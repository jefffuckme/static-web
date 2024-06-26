---
layout: post
title:  java 从零开始实现消息队列 mq-04-启动初始化代码优化&broker 启动连接 check 
date:  2022-04-15 09:22:02 +0800
categories: [MQ]
tags: [mq, netty, sh]
published: true
---

# 前景回顾

[【mq】从零开始实现 mq-01-生产者、消费者启动 ](https://mp.weixin.qq.com/s/moF528JiVG9dqCi5oFMbVg)

[【mq】从零开始实现 mq-02-如何实现生产者调用消费者？](https://mp.weixin.qq.com/s/_OF4hbh9llaxN27Cv_cToQ)

[【mq】从零开始实现 mq-03-引入 broker 中间人](https://mp.weixin.qq.com/s/BvEWsLp3_35yFVRqBOxS2w)

[【mq】从零开始实现 mq-04-启动检测与实现优化](https://mp.weixin.qq.com/s/BvEWsLp3_35yFVRqBOxS2w)

上一节我们引入了中间人 broker，让消息的生产者和消费者解耦。

这一节我们对初始化代码进行优化，便于后期拓展维护。

![启动检测](https://img-blog.csdnimg.cn/15c2b1dd62c5494b8d8070e8589d913a.png#pic_center)

# 生产者启动优化

## 启动实现

整体实现调整如下：

```java
@Override
public synchronized void run() {
    this.paramCheck();
    // 启动服务端
    log.info("MQ 生产者开始启动客户端 GROUP: {}, PORT: {}, brokerAddress: {}",
            groupName, port, brokerAddress);
    try {
        //channel future
        this.channelFutureList = ChannelFutureUtils.initChannelFutureList(brokerAddress,
                initChannelHandler(), check);

        // register to broker
        this.registerToBroker();

        // 标识为可用
        enableFlag = true;
        log.info("MQ 生产者启动完成");
    } catch (Exception e) {
        log.error("MQ 生产者启动遇到异常", e);
        throw new MqException(ProducerRespCode.RPC_INIT_FAILED);
    }
}
```

看起来是不是比起原来清爽很多呢？

但是**复杂性只会转移，不会消失**。

答案就是封装到 initChannelFutureList 中去了。

## initChannelFutureList 

因为这里是生产者、消费者都会用到。

所以我们先放在统一的工具类中，实现本身和以前大同小异。

```java
/**
 * 初始化列表
 * @param brokerAddress 地址
 * @param channelHandler 处理类
 * @param check 是否检测可用性
 * @return 结果
 * @since 0.0.4
 */
public static List<RpcChannelFuture> initChannelFutureList(final String brokerAddress,
                                                           final ChannelHandler channelHandler,
                                                           final boolean check) {
    List<RpcAddress> addressList = InnerAddressUtils.initAddressList(brokerAddress);
    List<RpcChannelFuture> list = new ArrayList<>();
    for(RpcAddress rpcAddress : addressList) {
        try {
            final String address = rpcAddress.getAddress();
            final int port = rpcAddress.getPort();
            EventLoopGroup workerGroup = new NioEventLoopGroup();
            Bootstrap bootstrap = new Bootstrap();
            ChannelFuture channelFuture = bootstrap.group(workerGroup)
                    .channel(NioSocketChannel.class)
                    .option(ChannelOption.SO_KEEPALIVE, true)
                    .handler(new ChannelInitializer<Channel>(){
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ch.pipeline()
                                    .addLast(new LoggingHandler(LogLevel.INFO))
                                    .addLast(channelHandler);
                        }
                    })
                    .connect(address, port)
                    .syncUninterruptibly();
            log.info("启动客户端完成，监听 address: {}, port：{}", address, port);
            RpcChannelFuture rpcChannelFuture = new RpcChannelFuture();
            rpcChannelFuture.setChannelFuture(channelFuture);
            rpcChannelFuture.setAddress(address);
            rpcChannelFuture.setPort(port);
            rpcChannelFuture.setWeight(rpcAddress.getWeight());
            list.add(rpcChannelFuture);
        } catch (Exception exception) {
            log.error("注册到 broker 服务端异常", exception);
            if(check) {
                throw new MqException(MqCommonRespCode.REGISTER_TO_BROKER_FAILED);
            }
        }
    }

    if(check
        && CollectionUtil.isEmpty(list)) {
        log.error("check=true 且可用列表为空，启动失败。");
        throw new MqException(MqCommonRespCode.REGISTER_TO_BROKER_FAILED);
    }
    return list;
}
```

这里的 check 为了避免 2 种情况：

（1）某一个 broker 不可用

（2）没有可用的 broker 信息。


# 消费者启动优化

消费者连接 broker 和生产者是类似的。

这里只是放一下实现，不做更多的赘述。

```java
@Override
public void run() {
    // 启动服务端
    log.info("MQ 消费者开始启动服务端 groupName: {}, brokerAddress: {}",
            groupName, brokerAddress);
    //1. 参数校验
    this.paramCheck();
    try {
        //channel future
        this.channelFutureList = ChannelFutureUtils.initChannelFutureList(brokerAddress,
                initChannelHandler(),
                check);

        // register to broker
        this.registerToBroker();

        // 标识为可用
        enableFlag = true;
        log.info("MQ 消费者启动完成");
    } catch (Exception e) {
        log.error("MQ 消费者启动异常", e);
        throw new MqException(ConsumerRespCode.RPC_INIT_FAILED);
    }
}
```

# 小结

这一小节的内容特别简单，对初始化部分做了优化，便于后期维护拓展。

希望本文对你有所帮助，如果喜欢，欢迎点赞收藏转发一波。

我是老马，期待与你的下次重逢。

# 开源地址

> [The message queue in java.(java 简易版本 mq 实现) ](https://github.com/houbb/mq) https://github.com/houbb/mq

# 拓展阅读

[rpc-从零开始实现 rpc](https://github.com/houbb/rpc) https://github.com/houbb/rpc

* any list
{:toc}