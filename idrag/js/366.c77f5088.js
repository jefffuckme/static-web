"use strict";(self["webpackChunkidrag"]=self["webpackChunkidrag"]||[]).push([[366],{2689:function(e,t,n){n.d(t,{Z:function(){return c}});var l,i,s=n(4003),r={props:{linkage:{type:Object,default:()=>{}},element:{type:Object,default:()=>{}}},created(){this.linkage?.data?.length&&(s.Z.$on("v-click",this.onClick),s.Z.$on("v-hover",this.onHover))},mounted(){const{data:e,duration:t}=this.linkage||{};e?.length&&(this.$el.style.transition=`all ${t}s`)},beforeDestroy(){this.linkage?.data?.length&&(s.Z.$off("v-click",this.onClick),s.Z.$off("v-hover",this.onHover))},methods:{changeStyle(e=[]){e.forEach((e=>{e.style.forEach((e=>{e.key&&(this.element.style[e.key]=e.value)}))}))},onClick(e){const t=this.linkage.data.filter((t=>t.id===e&&"v-click"===t.event));this.changeStyle(t)},onHover(e){const t=this.linkage.data.filter((t=>t.id===e&&"v-hover"===t.event));this.changeStyle(t)}}},a=r,o=n(1001),h=(0,o.Z)(a,l,i,!1,null,null,null),c=h.exports},6366:function(e,t,n){n.r(t),n.d(t,{default:function(){return c}});var l=function(){var e=this,t=e._self._c;return t("div",{staticClass:"svg-triangle-container"},[t("svg",{attrs:{version:"1.1",baseProfile:"full",xmlns:"http://www.w3.org/2000/svg"}},[t("polygon",{ref:"triangle",attrs:{points:e.points,stroke:e.element.style.borderColor,fill:e.element.style.backgroundColor,"stroke-width":"1"}})]),t("v-text",{attrs:{"prop-value":e.element.propValue,element:e.element}})],1)},i=[],s=n(2689),r={extends:s.Z,props:{propValue:{type:String,required:!0,default:""},element:{type:Object,default:()=>{}}},data(){return{points:""}},watch:{"element.style.width":function(){this.draw()},"element.style.height":function(){this.draw()}},mounted(){this.draw()},methods:{draw(){const{width:e,height:t}=this.element.style;this.drawTriangle(e,t)},drawTriangle(e,t){const n=[[.5,.05],[1,.95],[0,.95]],l=n.map((n=>e*n[0]+" "+t*n[1]));this.points=l.toString()}}},a=r,o=n(1001),h=(0,o.Z)(a,l,i,!1,null,"6aec75f7",null),c=h.exports}}]);
//# sourceMappingURL=366.c77f5088.js.map