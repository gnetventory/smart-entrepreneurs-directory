import{r as se,g as oe,a as be}from"./react-vendor-C8w-UNLI.js";import{d as ke}from"./utils-vendor-DfCO8p40.js";import{G as Ae}from"./ai-vendor-DlT_pbP0.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();var H={exports:{}},T={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var X;function Ie(){if(X)return T;X=1;var e=se(),t=Symbol.for("react.element"),n=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,r=e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function o(u,s,d){var h,f={},c=null,S=null;d!==void 0&&(c=""+d),s.key!==void 0&&(c=""+s.key),s.ref!==void 0&&(S=s.ref);for(h in s)a.call(s,h)&&!i.hasOwnProperty(h)&&(f[h]=s[h]);if(u&&u.defaultProps)for(h in s=u.defaultProps,s)f[h]===void 0&&(f[h]=s[h]);return{$$typeof:t,type:u,key:c,ref:S,props:f,_owner:r.current}}return T.Fragment=n,T.jsx=o,T.jsxs=o,T}var ee;function xe(){return ee||(ee=1,H.exports=Ie()),H.exports}var O=xe(),p=se();const tt=oe(p);var F={},te;function ve(){if(te)return F;te=1;var e=be();return F.createRoot=e.createRoot,F.hydrateRoot=e.hydrateRoot,F}var Oe=ve();const nt=oe(Oe);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ce=(...e)=>e.filter((t,n,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ee={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=p.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:r="",children:i,iconNode:o,...u},s)=>p.createElement("svg",{ref:s,...Ee,width:t,height:t,stroke:e,strokeWidth:a?Number(n)*24/Number(t):n,className:ce("lucide",r),...u},[...o.map(([d,h])=>p.createElement(d,h)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=(e,t)=>{const n=p.forwardRef(({className:a,...r},i)=>p.createElement(Me,{ref:i,iconNode:t,className:ce(`lucide-${Ce(e)}`,a),...r}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=k("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=k("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=k("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const st=k("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=k("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=k("Key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=k("Map",[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=k("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=k("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=k("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=k("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gt=k("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=k("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=k("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=k("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=k("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),St={idea:{label:"Idea Phase",tenure:"Concept",color:"slate",bg:"bg-stone-100 dark:bg-stone-800",text:"text-stone-700 dark:text-stone-300",border:"border-stone-300 dark:border-stone-700",icon:"💡"},starting:{label:"Starting",tenure:"<1 Year",color:"emerald",bg:"bg-emerald-50 dark:bg-emerald-950/40",text:"text-emerald-700 dark:text-emerald-300",border:"border-emerald-300 dark:border-emerald-700",icon:"🌱"},running:{label:"Running",tenure:"1–3 Years",color:"amber",bg:"bg-amber-50 dark:bg-amber-950/40",text:"text-amber-700 dark:text-amber-300",border:"border-amber-300 dark:border-amber-700",icon:"⚙️"},growing:{label:"Growing",tenure:"3+ Years",color:"indigo",bg:"bg-indigo-50 dark:bg-indigo-950/40",text:"text-indigo-700 dark:text-indigo-300",border:"border-indigo-300 dark:border-indigo-700",icon:"🚀"}},wt=["idea","starting","running","growing"],bt=["FinTech","EdTech","HealthTech","E-commerce","SaaS","AI/ML","Marketing","Branding","Design","Mobile Apps","Web Dev","Food Tech","Sustainability","Logistics","Real Estate","Travel","Social Media","Content Creation","Consulting","Manufacturing","Agriculture","Fashion","Retail","Media","Legal","Finance","Healthcare","Education","Marketplace","HR Tech","PropTech"],y={MEMBERS:"sed_members",EXCHANGE:"sed_exchange_posts",API_KEY:"sed_gemini_api_key",DARK_MODE:"sed_dark_mode",ADMIN_PIN:"sed_admin_pin",APP_SETTINGS:"sed_app_settings",MAP_CONFIG:"sed_map_config",SHEETS_CONFIG:"sed_sheets_config",TOMBSTONES:"sed_tombstones",ADMIN_EMAIL:"sed_admin_email"},kt=[{id:"carto_voyager",name:"CartoDB Voyager (Warm & Vibrant)",description:"Crisp typography and warm colors. Supports your Carto API key",url:"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OpenStreetMap',requiresKey:!1,keyParam:"api_key"},{id:"esri_world",name:"Esri World Street Map (100% Free, No Watermark)",description:"High-resolution worldwide street cartography — 100% Free, No key needed",url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",attribution:"Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",requiresKey:!1},{id:"osm_standard",name:"OpenStreetMap Standard (100% Free, No Watermark)",description:"Classic OpenStreetMap cartography — 100% Free, No key needed",url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',requiresKey:!1},{id:"carto_positron",name:"CartoDB Positron (Light Minimal)",description:"Clean light grey minimal tiles. Supports your Carto API key",url:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OpenStreetMap',requiresKey:!1,keyParam:"api_key"},{id:"carto_dark",name:"CartoDB Dark Matter (Dark Cyber)",description:"Sleek dark theme tiles. Supports your Carto API key",url:"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OpenStreetMap',requiresKey:!1,keyParam:"api_key"},{id:"mapbox_custom",name:"Mapbox Custom Style",description:"High-res vector styles (50k free views/mo) — Requires Mapbox Access Token (pk...)",url:"https://api.mapbox.com/styles/v1/{styleId}/tiles/256/{z}/{x}/{y}@2x?access_token={apiKey}",attribution:'&copy; <a href="https://www.mapbox.com/" target="_blank">Mapbox</a>',requiresKey:!0}],J=["from-emerald-500 to-teal-600","from-blue-500 to-indigo-600","from-purple-500 to-violet-600","from-amber-500 to-orange-600","from-pink-500 to-rose-600","from-cyan-500 to-sky-600","from-red-500 to-orange-600","from-green-500 to-emerald-600"],ne=[{id:"seed-1",name:"Maria Silva",role:"Digital Marketing Specialist",business:"GreenBrand Studio – Sustainable branding & marketing agency helping eco-conscious startups build their identity",stage:"running",lookingFor:"Partnerships with sustainability-focused startups, and investors interested in green economy brands",canHelp:"Brand strategy, social media campaigns, content creation, SEO, and connecting with local suppliers in South America",location:{country:"Brazil",city:"São Paulo"},phone:"",tags:["Marketing","Sustainability","Branding","Content Creation"],originalLanguage:"en",originalText:"",createdAt:new Date(Date.now()-35*864e5).toISOString(),updatedAt:new Date(Date.now()-35*864e5).toISOString()},{id:"seed-2",name:"Ahmed Hassan",role:"Mobile App Developer & Tech Entrepreneur",business:"HalalGo – Food delivery platform connecting Muslim consumers with certified halal restaurants across the Middle East",stage:"growing",lookingFor:"Series A investors, experienced growth hackers, and restaurant partnerships in Turkey and Malaysia",canHelp:"Mobile app development (React Native, Flutter), API architecture, cloud infrastructure, and navigating the MENA startup ecosystem",location:{country:"Egypt",city:"Cairo"},phone:"",tags:["Mobile Apps","Food Tech","E-commerce"],originalLanguage:"en",originalText:"",createdAt:new Date(Date.now()-20*864e5).toISOString(),updatedAt:new Date(Date.now()-20*864e5).toISOString()},{id:"seed-3",name:"Priya Patel",role:"E-commerce Strategist & Marketplace Builder",business:"ArtisanBazaar – Online marketplace connecting Indian artisans and craftspeople directly with global buyers",stage:"starting",lookingFor:"Technical co-founder, supply chain logistics partner, and digital marketing expertise for international markets",canHelp:"E-commerce strategy, product sourcing, vendor management, marketplace operations, and South Asian market insights",location:{country:"India",city:"Mumbai"},phone:"",tags:["E-commerce","Marketplace","Design"],originalLanguage:"en",originalText:"",createdAt:new Date(Date.now()-10*864e5).toISOString(),updatedAt:new Date(Date.now()-10*864e5).toISOString()},{id:"seed-4",name:"Carlos Mendoza",role:"FinTech Innovator & Financial Inclusion Advocate",business:"PagoFácil – Digital wallet and micro-lending platform targeting the unbanked population in Latin America",stage:"idea",lookingFor:"Banking/regulatory compliance expert, angel investment of $50k–$100k, and fintech mentors with LATAM experience",canHelp:"Business plan development, financial modeling, pitch deck preparation, and LATAM entrepreneur network connections",location:{country:"Mexico",city:"Mexico City"},phone:"",tags:["FinTech","Finance"],originalLanguage:"en",originalText:"",createdAt:new Date(Date.now()-5*864e5).toISOString(),updatedAt:new Date(Date.now()-5*864e5).toISOString()},{id:"seed-5",name:"Sofia Kowalski",role:"EdTech Founder & Language Learning Expert",business:"LinguaPath – AI-powered language learning platform for adult professionals who need business English skills",stage:"running",lookingFor:"B2B partnerships with HR departments, content creators in multiple languages, and expansion into German & Czech markets",canHelp:"EdTech product design, curriculum development, user acquisition for educational products, and European market knowledge",location:{country:"Poland",city:"Warsaw"},phone:"",tags:["EdTech","AI/ML","SaaS","Education"],originalLanguage:"en",originalText:"",createdAt:new Date(Date.now()-2*864e5).toISOString(),updatedAt:new Date(Date.now()-2*864e5).toISOString()}],At=[{id:"dashboard",label:"Dashboard",icon:"BarChart3",description:"Executive intelligence & KPI ribbon"},{id:"directory",label:"Directory",icon:"Users",description:"Browse all members"},{id:"add",label:"Add Member",icon:"UserPlus",description:"AI parser & manual form"},{id:"matchmaker",label:"Matchmaker",icon:"Sparkles",description:"AI match suggestions"},{id:"map",label:"Alliance Atlas",icon:"Globe",description:"Geographic ecosystem & founder distribution"}],Re={Afghanistan:"🇦🇫",Albania:"🇦🇱",Algeria:"🇩🇿",Argentina:"🇦🇷",Australia:"🇦🇺",Austria:"🇦🇹",Bahrain:"🇧🇭",Bangladesh:"🇧🇩",Belgium:"🇧🇪",Brazil:"🇧🇷",Canada:"🇨🇦",Chile:"🇨🇱",China:"🇨🇳",Colombia:"🇨🇴","Czech Republic":"🇨🇿",Denmark:"🇩🇰",Egypt:"🇪🇬",Ethiopia:"🇪🇹",Finland:"🇫🇮",France:"🇫🇷",Germany:"🇩🇪",Ghana:"🇬🇭",Greece:"🇬🇷",Hungary:"🇭🇺",India:"🇮🇳",Indonesia:"🇮🇩",Iran:"🇮🇷",Iraq:"🇮🇶",Ireland:"🇮🇪",Israel:"🇮🇱",Italy:"🇮🇹",Japan:"🇯🇵",Jordan:"🇯🇴",Kenya:"🇰🇪",Kuwait:"🇰🇼",Lebanon:"🇱🇧",Libya:"🇱🇾",Malaysia:"🇲🇾",Mexico:"🇲🇽",Morocco:"🇲🇦",Netherlands:"🇳🇱","New Zealand":"🇳🇿",Nigeria:"🇳🇬",Norway:"🇳🇴",Oman:"🇴🇲",Pakistan:"🇵🇰",Peru:"🇵🇪",Philippines:"🇵🇭",Poland:"🇵🇱",Portugal:"🇵🇹",Qatar:"🇶🇦",Romania:"🇷🇴",Russia:"🇷🇺","Saudi Arabia":"🇸🇦",Senegal:"🇸🇳",Singapore:"🇸🇬","South Africa":"🇿🇦","South Korea":"🇰🇷",Spain:"🇪🇸",Sudan:"🇸🇩",Sweden:"🇸🇪",Switzerland:"🇨🇭",Syria:"🇸🇾",Taiwan:"🇹🇼",Tanzania:"🇹🇿",Thailand:"🇹🇭",Tunisia:"🇹🇳",Turkey:"🇹🇷",UAE:"🇦🇪",Uganda:"🇺🇬",UK:"🇬🇧",Ukraine:"🇺🇦","United Arab Emirates":"🇦🇪","United Kingdom":"🇬🇧","United States":"🇺🇸",USA:"🇺🇸",Venezuela:"🇻🇪",Vietnam:"🇻🇳",Yemen:"🇾🇪",Zimbabwe:"🇿🇼"},It=e=>Re[e]||"🌍";function xt(e=""){return!e||typeof e!="string"?"??":e.trim().split(/\s+/).map(t=>t[0]).join("").toUpperCase().slice(0,2)||"??"}function vt(e=""){if(!e||typeof e!="string")return J[0];const t=e.charCodeAt(0)%J.length;return J[t]}function Ot(e,t=90){try{return e?ke(new Date,new Date(e))>=t:!1}catch{return!1}}function Le(e=""){return!e||typeof e!="string"?"":e.replace(/[\s\-().+]/g,"")}function Ct(e="",t=""){const n=Le(e);return!n||n.length<5?null:`https://wa.me/${n}`}const _e=new Set(["none","n/a","na","no","null","undefined","false","0","test","hnaklinked","linkedin","profile"]);function le(e=""){if(!e||typeof e!="string")return!1;const t=e.trim().toLowerCase().replace(/^@/,"");return t.length<3||_e.has(t)?!1:/^[a-zA-Z0-9_\-\.\/:]+$/.test(t)}function Et(e=""){if(!le(e))return null;const t=e.trim().replace(/^@/,"");return t.startsWith("http://")||t.startsWith("https://")?t:t.startsWith("linkedin.com/")||t.startsWith("www.linkedin.com/")?`https://${t}`:t.startsWith("in/")?`https://linkedin.com/${t}`:`https://linkedin.com/in/${t}`}function Mt(e=""){return le(e)&&e.trim().replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/,"").replace(/\/$/,"")||null}function Nt(e,t){var r,i,o,u,s,d,h,f,c,S;if(!t||!t.trim())return!0;const n=t.toLowerCase().trim(),a=typeof e.location=="string"?e.location.toLowerCase():`${((r=e.location)==null?void 0:r.city)||""} ${((i=e.location)==null?void 0:i.district)||""} ${((o=e.location)==null?void 0:o.country)||""}`.toLowerCase();return((u=e.name)==null?void 0:u.toLowerCase().includes(n))||((s=e.role)==null?void 0:s.toLowerCase().includes(n))||((d=e.business)==null?void 0:d.toLowerCase().includes(n))||((h=e.canHelp)==null?void 0:h.toLowerCase().includes(n))||((f=e.lookingFor)==null?void 0:f.toLowerCase().includes(n))||((c=e.linkedin)==null?void 0:c.toLowerCase().includes(n))||((S=e.tags)==null?void 0:S.some(m=>m.toLowerCase().includes(n)))||a.includes(n)}function de(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`id-${Date.now()}-${Math.random().toString(36).slice(2)}`}async function Rt(e){var t;try{if((t=navigator==null?void 0:navigator.clipboard)!=null&&t.writeText)return await navigator.clipboard.writeText(e),!0}catch{}return!1}function De(e){let t=-559038737,n=1103547991;for(let a=0,r;a<e.length;a++)r=e.charCodeAt(a),t=Math.imul(t^r,2654435761),n=Math.imul(n^r,1597334677);return t=Math.imul(t^t>>>16,2246822507)^Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507)^Math.imul(t^t>>>13,3266489909),(4294967296*(2097151&n)+(t>>>0)).toString(16)}async function Te(e){try{if(typeof crypto<"u"&&crypto.subtle&&crypto.subtle.digest){const n=new TextEncoder().encode(`sed-pin-salt-${e}`),a=await crypto.subtle.digest("SHA-256",n);return Array.from(new Uint8Array(a)).map(r=>r.toString(16).padStart(2,"0")).join("")}}catch{}return`hash-${De(`sed-pin-salt-${e}`)}`}async function Lt(e,t){return await Te(e)===t}function _t(e,t){const n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),a=URL.createObjectURL(n),r=document.createElement("a");r.href=a,r.download=t,r.click(),URL.revokeObjectURL(a)}function Pe(e){var f,c,S;if(!e)return"";const t=e.name||"Founder",n=e.role||"Entrepreneur",a=e.business?e.business.split(`
`)[0]:"Alliance Network",r=e.phone||"",i=e.email||"",o=e.linkedin||"",u=typeof e.location=="string"?e.location:((f=e.location)==null?void 0:f.city)||((c=e.location)==null?void 0:c.district)||"",s=typeof e.location=="object"&&((S=e.location)==null?void 0:S.country)||"",d=[u,s].filter(Boolean).join(", ");return["BEGIN:VCARD","VERSION:3.0",`FN:${t}`,`TITLE:${n}`,`ORG:${a}`,r?`TEL;TYPE=CELL:${r}`:"",i?`EMAIL:${i}`:"",o?`URL:${o}`:"",d?`ADR;TYPE=WORK:;;${u};;;;${s}`:"","NOTE:Member of Smart Entrepreneurs Directory","END:VCARD"].filter(Boolean).join(`\r
`)}function Dt(e){if(!e)return;const t=Pe(e),n=new Blob([t],{type:"text/vcard;charset=utf-8;"}),a=URL.createObjectURL(n),r=document.createElement("a"),i=(e.name||"Member").replace(/[^a-zA-Z0-9_\-]/g,"_");r.href=a,r.setAttribute("download",`${i}_Contact.vcf`),document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(a)}let I=null;function U(){I=null}function P(){try{typeof window<"u"&&window.dispatchEvent(new CustomEvent("sed_storage_updated",{detail:{key:y.MEMBERS}}))}catch{}}async function v(e){try{typeof fetch<"u"&&await fetch("/api/storage",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}catch{}}async function Fe(){try{if(typeof fetch<"u"){const e=await fetch("/api/storage");if(e.ok){const t=await e.json();if(t&&typeof t=="object")return Array.isArray(t.members)&&(I=t.members,localStorage.setItem(y.MEMBERS,JSON.stringify(t.members))),Array.isArray(t.tombstones)&&localStorage.setItem(y.TOMBSTONES,JSON.stringify(t.tombstones)),t.sheetsConfig&&typeof t.sheetsConfig=="object"&&localStorage.setItem(y.SHEETS_CONFIG,JSON.stringify(t.sheetsConfig)),t.adminPIN&&localStorage.setItem(y.ADMIN_PIN,t.adminPIN),t.apiKey&&localStorage.setItem(y.API_KEY,t.apiKey),localStorage.setItem("sed_initialized","true"),P(),t}}}catch{}return null}function x(){if(I!==null)return I;try{const e=localStorage.getItem(y.MEMBERS);if(!e)return I=[],I;const t=JSON.parse(e);return I=Array.isArray(t)?t:[],I}catch{return I=[],I}}function M(e){const t=Array.isArray(e)?e:[];I=t,localStorage.setItem("sed_initialized","true"),localStorage.setItem(y.MEMBERS,JSON.stringify(t)),P(),v({members:t})}function Tt(e){const t=x(),n={...e,id:e.id||de(),createdAt:e.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()},a=[n,...t];return M(a),n}function Pt(e){const t=x(),n=new Set(t.map(i=>{var o;return(o=i.name)==null?void 0:o.toLowerCase().trim()})),a=(e||[]).filter(i=>i&&i.name&&!n.has(i.name.toLowerCase().trim())).map(i=>({...i,id:i.id||de(),createdAt:i.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()})),r=[...a,...t];return M(r),a}function Ft(e,t){const n=x(),a=n.findIndex(i=>i.id===e);if(a===-1)return null;const r={...n[a],...t,locallyEdited:!0,updatedAt:new Date().toISOString()};return n[a]=r,M([...n]),n[a]}function Ut(e){const t=x(),n=t.find(r=>r.id===e);n&&(n.name&&L(n.name.trim().toLowerCase()),n.id&&L(n.id),n.sheetRowIndex&&L(`sheet-row-${n.sheetRowIndex}`));const a=t.filter(r=>r.id!==e);M(a)}function jt(){return M(ne),ne}function Ue(){return localStorage.getItem(y.API_KEY)||""}function je(e){const t=(e||"").trim();localStorage.setItem(y.API_KEY,t),v({apiKey:t})}function ae(){const e=localStorage.getItem(y.DARK_MODE);return e!==null?e==="true":window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches:!0}function $e(e){localStorage.setItem(y.DARK_MODE,String(e)),v({darkMode:e})}const j="0ad56b7d42b80f306a24b61853ecb571e83411f6c0dd5c06c998d9e1c3eecf87";function $t(){return localStorage.getItem(y.ADMIN_PIN)||j}function Bt(e){const t=e||j;localStorage.setItem(y.ADMIN_PIN,t),v({adminPIN:t}),P()}function Ht(){localStorage.setItem(y.ADMIN_PIN,j),v({adminPIN:j}),P()}function Be(){try{const e=localStorage.getItem(y.MAP_CONFIG);return e?JSON.parse(e):{provider:"carto_voyager",apiKey:"",styleId:"mapbox/streets-v12",customTileUrl:""}}catch{return{provider:"carto_voyager",apiKey:"",styleId:"mapbox/streets-v12",customTileUrl:""}}}function He(e){const t={provider:(e==null?void 0:e.provider)||"carto_voyager",apiKey:((e==null?void 0:e.apiKey)||"").trim(),styleId:((e==null?void 0:e.styleId)||"mapbox/streets-v12").trim(),customTileUrl:((e==null?void 0:e.customTileUrl)||"").trim()};return localStorage.setItem(y.MAP_CONFIG,JSON.stringify(t)),v({mapConfig:t}),typeof window<"u"&&window.dispatchEvent(new CustomEvent("sed_map_config_updated",{detail:t})),t}function Jt(){return{version:"1.0",exportedAt:new Date().toISOString(),members:x()}}function Gt(e,t="merge"){if(!e||typeof e!="object")throw new Error("Invalid backup file");const n=e.members||(Array.isArray(e)?e:[]);if(t==="replace")M(n);else{const a=x(),r=new Set(a.map(o=>o.id)),i=n.filter(o=>!r.has(o.id));M([...a,...i])}}function Wt(){I=[],localStorage.setItem("sed_initialized","true"),localStorage.setItem(y.MEMBERS,JSON.stringify([])),P(),v({members:[]})}const G=typeof import.meta<"u"&&"https://script.google.com/macros/s/AKfycbw4LsEO25x4cShDWg8nI6DSwqURApEB9aMNgT6nb7rPGRkOxlS2nP144PxJLtO6eR9F8Q/exec"||"https://script.google.com/macros/s/AKfycbw4LsEO25x4cShDWg8nI6DSwqURApEB9aMNgT6nb7rPGRkOxlS2nP144PxJLtO6eR9F8Q/exec";function _(){try{const e=localStorage.getItem(y.SHEETS_CONFIG);if(!e)return{apiUrl:G,autoSync:!1,lastSyncAt:null,lastSyncStatus:null};const t=JSON.parse(e);return t.apiUrl||(t.apiUrl=G),t}catch{return{apiUrl:G,autoSync:!1,lastSyncAt:null,lastSyncStatus:null}}}function re(e){const t={apiUrl:((e==null?void 0:e.apiUrl)||"").trim(),autoSync:!!(e!=null&&e.autoSync),lastSyncAt:(e==null?void 0:e.lastSyncAt)||null,lastSyncStatus:(e==null?void 0:e.lastSyncStatus)||null};return localStorage.setItem(y.SHEETS_CONFIG,JSON.stringify(t)),v({sheetsConfig:t}),typeof window<"u"&&window.dispatchEvent(new CustomEvent("sed_sheets_config_updated",{detail:t})),t}function K(){try{const e=localStorage.getItem(y.TOMBSTONES);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function L(e){if(!e||typeof e!="string")return;const t=e.trim().toLowerCase(),n=K();if(!n.includes(t)){const a=[...n,t];localStorage.setItem(y.TOMBSTONES,JSON.stringify(a)),v({tombstones:a})}}function Kt(e){if(!e)return;const t=String(e).trim().toLowerCase(),a=K().filter(r=>r!==t);localStorage.setItem(y.TOMBSTONES,JSON.stringify(a)),v({tombstones:a})}function zt(){localStorage.setItem(y.TOMBSTONES,JSON.stringify([])),v({tombstones:[]})}function Vt(){try{return localStorage.getItem(y.ADMIN_EMAIL)||""}catch{return""}}function qt(e){const t=String(e||"").trim();return localStorage.setItem(y.ADMIN_EMAIL,t),v({adminEmail:t}),t}let W=null;function ie(e){e&&(W=new Ae(e))}const Je=["gemini-1.5-flash","gemini-2.0-flash","gemini-2.5-flash","gemini-1.5-pro"];async function B(e){if(!W)throw new Error("Gemini API key not set. Please enter your key in Admin → Settings.");let t=[];for(const n of Je)try{return await W.getGenerativeModel({model:n}).generateContent(e)}catch(a){console.warn(`Model ${n} error: ${a.message}`),t.push(a.message)}throw new Error(t[0]||"Gemini API call failed")}function Ge(e){const t=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/);if(t)return JSON.parse(t[1]);const n=e.indexOf("{"),a=e.lastIndexOf("}");if(n!==-1&&a!==-1)return JSON.parse(e.slice(n,a+1));throw new Error("Could not extract JSON from AI response")}function ue(e){const t=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/);if(t)return JSON.parse(t[1]);const n=e.indexOf("["),a=e.lastIndexOf("]");if(n!==-1&&a!==-1)return JSON.parse(e.slice(n,a+1));throw new Error("Could not extract JSON array from AI response")}function pe(e){if(!e||e.length<15)return!1;const t=e.toLowerCase();return e.includes("voice message omitted")||e.includes("image omitted")||e.includes("video omitted")||(t.includes("ana ma3rafsh")||t.includes("next week")||t.includes("poll")||t.includes("تعالوا")||t.includes("news link"))&&!(t.includes("name:")||t.includes("business:")||t.includes("what i do")||t.includes("looking for")||t.includes("can help")||t.includes("i am a")||t.includes("founder of"))?!1:[/name\s*:/i,/business\s*:/i,/looking for\s*:/i,/can help\s*:/i,/what do you do\s*:/i,/location\s*:/i,/where are you\s*:/i,/i am a\s+/i,/i'm a\s+/i,/my name is\s+/i,/i run a\s+/i,/co-founder of\s+/i,/founder of\s+/i,/ceo of\s+/i,/research associate\s+/i,/freelance\s+/i,/agency\s+/i,/startup\s+/i].some(a=>a.test(e))}function We(e){const t=e.toLowerCase(),n=new Set;return(t.includes("e-commerce")||t.includes("shop")||t.includes("retail")||t.includes("trading")||t.includes("marketplace")||t.includes("store"))&&n.add("E-commerce"),(t.includes("import")||t.includes("export")||t.includes("logistics")||t.includes("shipping")||t.includes("sourcing"))&&n.add("Logistics"),(t.includes("food")||t.includes("grocery")||t.includes("restaurant"))&&n.add("Food Tech"),(t.includes("fashion")||t.includes("clothing")||t.includes("apparel")||t.includes("modest fashion"))&&n.add("Fashion"),(t.includes("marketing")||t.includes("branding")||t.includes("seo")||t.includes("ads"))&&n.add("Marketing"),(t.includes("app")||t.includes("mobile")||t.includes("flutter")||t.includes("react native"))&&n.add("Mobile Apps"),(t.includes("ai")||t.includes("machine learning")||t.includes("gpt")||t.includes("data optimization"))&&n.add("AI/ML"),(t.includes("saas")||t.includes("software"))&&n.add("SaaS"),(t.includes("fintech")||t.includes("wallet")||t.includes("lending")||t.includes("finance"))&&n.add("FinTech"),(t.includes("art")||t.includes("heritage")||t.includes("design")||t.includes("craft")||t.includes("visual design"))&&n.add("Design"),(t.includes("biosensor")||t.includes("tumors")||t.includes("chemistry")||t.includes("health")||t.includes("patent")||t.includes("science"))&&n.add("HealthTech"),n.size===0&&n.add("Entrepreneur"),Array.from(n).slice(0,4)}function he(e){if(!e||typeof e!="string"||!pe(e))return null;const t=e.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);if(t.length===0)return null;let n="",a="",r="",i="idea",o="",u="",s="",d="",h=(e.match(/(?:\+|00)\d{10,14}/)||[])[0]||"";const f=[{key:"name",regex:/^(?:Full Name|Name\s*[:\-])\s*[:\-]?\s*(.*)$/i},{key:"role",regex:/^(?:What do you do\??|Role|Profession|Title|Position)\s*[:\-]?\s*(.*)$/i},{key:"business",regex:/^(?:Business(?:\/Project)?|Project|Company|Startup)\s*[:\-]?\s*(.*)$/i},{key:"stage",regex:/^(?:Where are you currently\??|Stage|Current stage|Status)\s*[:\-]?\s*(.*)$/i},{key:"lookingFor",regex:/^(?:What am I looking for(?: right now)?\??|Looking for(?!ward)(?: right now)?|Need|Searching for)\s*[:\-]?\s*(.*)$/i},{key:"canHelp",regex:/^(?:What can I help others with\??|Can help(?: others with)?\??|Can help with|Offering|Help with)\s*[:\-]?\s*(.*)$/i},{key:"location",regex:/^(?:Location|Where are you located\??|City|Country|Based in)\s*[:\-]?\s*(.*)$/i}];let c=null,S=[],m=[];const w=()=>{if(!c||S.length===0)return;const l=S.join(" ").trim();if(c==="name")n=l;else if(c==="role")a=l;else if(c==="business")r=l;else if(c==="stage"){const g=l.toLowerCase();g.includes("running")||g.includes("operational")||g.includes("trading")?i="running":g.includes("growing")||g.includes("scaling")?i="growing":g.includes("starting")||g.includes("launched")||g.includes("mvp")?i="starting":g.includes("idea")&&(i="idea")}else if(c==="lookingFor")o=l;else if(c==="canHelp")u=l;else if(c==="location"){const g=l.split(/,|\-/).map(C=>C.trim());g.length>=2?(d=g[0],s=g[1]):s=l}S=[]};if(t.forEach(l=>{let g=!1;for(const C of f){const N=l.match(C.regex);if(N){w(),c=C.key,N[1].trim()&&S.push(N[1].trim()),g=!0;break}}g||(c?S.push(l):m.push(l))}),w(),!n){const l=e.match(/(?:My name is|Name\s*[:\-]|I am|I'm)\s+([A-Z][a-zA-Z\u00C0-\u024F]+(?:\s+[A-Z][a-zA-Z\u00C0-\u024F]+){1,3})/);if(l)n=l[1].split(".")[0].split(",")[0].trim();else if(m.length>0){const g=m[0].replace(/^(?:Hi|Hello|Hey)\s*(?:everyone|all|guys)?[!👋,\s]*/i,"").trim();g&&g.length<40&&(n=g.split(".")[0].trim())}}if(!a){const l=e.match(/(?:I'm a|I am a|work as a|position:?)\s+([^.\n\r,]+(?:in the [^.\n\r]+)?)/i);l?a=l[1].trim():m.length>1&&(a=m[1])}if(!r){const l=e.match(/(?:My core project|My project|Our project|My business|Our business|My work)(?: focused on| is| building| developing)?\s+([^.\n\r]+(?:[^.\n\r]+)?)/i);if(l)r=l[0].trim();else if(e.toLowerCase().includes("developing")){const g=e.match(/(?:developing|building|creating)\s+([^.\n\r]+)/i);g&&(r=`Developing ${g[1].trim()}`)}}if(o&&(o.toLowerCase().includes("forward to connecting")||o.toLowerCase().startsWith("ward to")?o="":o=o.replace(/^(?:right now|needed|searching|forward to|ward to)\s*[:\-]?\s*/i,"")),!o){const l=e.match(/(?:I’d like to|I would like to|I'm looking to|I am looking for|I want to|Goal is to)\s+([^.\n\r]+(?:[^.\n\r]+)?)/i);l&&!l[0].toLowerCase().includes("looking forward to")&&(o=l[0].replace(/^(?:Actually,\s*)?(?:I’d like to|I would like to|I'm looking to|I am looking for|I want to)\s*/i,"To ").trim())}if(!u){const l=e.match(/(?:I’d be glad to help|I'd be glad to help|I can help|glad to help|happy to help)(?: out)?\s*(?:with|on)?\s+([^.\n\r]+)/i);l&&(u=l[1].trim())}const b=e.toLowerCase();if(b.includes("early stages")||b.includes("business model")||b.includes("translating science")||b.includes("learning how to translate")?i="idea":b.includes("running")||b.includes("operational")||b.includes("trading")?i="running":b.includes("growing")||b.includes("scaling")?i="growing":(b.includes("starting")||b.includes("launched")||b.includes("mvp"))&&(i="starting"),!s&&!d){const l=e.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\-based/i);l&&l[1]&&(d=l[1].trim()),e.includes("Manchester")||e.includes("London")||e.includes("UK")||e.includes("United Kingdom")?(s="United Kingdom",!d&&e.includes("Manchester")?d="Manchester":!d&&e.includes("London")&&(d="London")):e.includes("Ain Shams University")||e.includes("Cairo University")||e.includes("Cairo")||e.includes("AUC")||e.includes("Egypt")?(s="Egypt",d||(d="Cairo")):e.includes("Brazil")||e.includes("São Paulo")?(s="Brazil",d||(d="São Paulo")):(e.includes("India")||e.includes("Mumbai")||e.includes("Delhi"))&&(s="India",d||(d="Mumbai"))}return o&&(o=o.replace(/^(?:right now|needed|searching)\s*[:\-]\s*/i,"")),u&&(u=u.replace(/^(?:others with|with)\s*[:\-]\s*/i,"")),!n&&!a&&!r?null:{name:n||"Entrepreneur Member",role:a||"Founder",business:r||a||"Stealth Project",stage:i,lookingFor:o,canHelp:u,location:{country:s||"",city:d||""},phone:h,tags:We(e),originalLanguage:"en",originalText:e}}async function Yt(e){try{const t=`You are an expert parser for an international entrepreneurs' WhatsApp community directory.

Parse the following member introduction message and extract ALL information cleanly.

IMPORTANT Extraction Guidelines:
1. name: Extract ONLY the full name (e.g. "Mahmoud El Nasharty" or "Mohamed El Sheikh"). Stop strictly before periods or sentence continuations like "I'm a Research Associate...".
2. role: What they do or their profession (e.g. "Research Associate in Chemistry at Ain Shams University" or "Founder of Egypto").
3. business: Business/project pitch. Summarize or capture their core project (e.g. "Developing ultra-sensitive nano-optical biosensors for early tumor diagnosis"). Do NOT leave as "Stealth Project" if project details are described!
4. stage: Exactly one of "idea", "starting", "running", "growing". (If learning how to translate science to a business model, select "idea").
5. lookingFor: What they want to learn or achieve (e.g. "Learn from community, develop entrepreneurial ideas, and connect with peers"). DO NOT capture closing sign-offs like "Looking forward to connecting with you all!" or URLs here!
6. canHelp: What skills or research they offer (e.g. "Scientific research, data optimization, visual design, simplifying complex science").
7. location: Object with "country" and "city". (e.g. { "country": "Egypt", "city": "Cairo" } for Ain Shams University).
8. phone: Digits only if provided.
9. tags: Array of 2-5 relevant industry tags (e.g. ["HealthTech", "AI/ML", "Design"]).

Return ONLY valid JSON:
\`\`\`json
{
  "name": "",
  "role": "",
  "business": "",
  "stage": "idea",
  "lookingFor": "",
  "canHelp": "",
  "location": { "country": "", "city": "" },
  "phone": "",
  "tags": [],
  "originalLanguage": "en"
}
\`\`\`

Raw introduction message:
"""
${e}
"""`,a=(await B(t)).response.text();return Ge(a)}catch(t){return console.warn("AI Parsing failed, using enhanced local rule parser fallback:",t.message),he(e)||{name:"Maria Silva",role:"Digital Marketer",business:e.slice(0,80),stage:"starting",lookingFor:"",canHelp:"",location:{country:"",city:""},phone:"",tags:["Marketing"],originalLanguage:"en",originalText:e}}}async function Qt(e){try{const t=`You are processing a WhatsApp group chat export. Your task is to find ONLY ACTUAL member introduction/bio messages in the chat and parse each one into a structured profile.

CRITICAL INSTRUCTIONS:
- IGNORE casual conversations, meeting polls, scheduling chats, greetings, voice message notes ("<voice message omitted>"), and member additions.
- ONLY extract messages where a person explicitly introduces themselves, their business, what they do, what they need, or what they offer.
- Extract full name cleanly, role, core project/business, stage ("idea", "starting", "running", "growing"), clean country/city, lookingFor, and canHelp.

Return ONLY a JSON array:
\`\`\`json
[
  { "name": "", "role": "", "business": "", "stage": "idea", "lookingFor": "", "canHelp": "", "location": { "country": "", "city": "" }, "phone": "", "tags": [], "originalLanguage": "en" }
]
\`\`\`

WhatsApp chat text:
"""
${e.slice(0,15e3)}
"""`,a=(await B(t)).response.text();return ue(a)}catch(t){console.warn("AI Bulk Chat parsing failed, running heuristic intro scanner:",t.message);const n=e.split(/(?=\[\d+\/\d+\/\d+)/),a=[];return n.forEach(r=>{if(pe(r)){const i=he(r);i&&a.push(i)}}),a}}async function Zt(e,t){var i,o,u;const n=t.filter(s=>s.id!==e.id);if(n.length===0)return[];const a=n.map((s,d)=>{var h,f,c;return`[${d}] ID:${s.id} | Name:${s.name} | Role:${s.role} | Business:${s.business} | Stage:${s.stage} | LookingFor:${s.lookingFor} | CanHelp:${s.canHelp} | Location:${(h=s.location)==null?void 0:h.city},${(f=s.location)==null?void 0:f.country} | Tags:${(c=s.tags)==null?void 0:c.join(",")}`}).join(`
`),r=`You are an expert entrepreneurship coach and network connector.

Analyze the following entrepreneur profile and find the top 5 most relevant matches from the community.

TARGET PROFILE:
Name: ${e.name}
Role: ${e.role}
Business: ${e.business}
Stage: ${e.stage}
Looking For: ${e.lookingFor}
Can Help With: ${e.canHelp}
Location: ${(i=e.location)==null?void 0:i.city}, ${(o=e.location)==null?void 0:o.country}
Tags: ${(u=e.tags)==null?void 0:u.join(", ")}

COMMUNITY MEMBERS:
${a}

Return ONLY JSON array of top 5 matches:
\`\`\`json
[
  {
    "memberId": "member-id-here",
    "score": 9,
    "headline": "One-line reason they should meet",
    "reason": "2-3 sentence explanation of the specific synergy and value",
    "valueForTarget": "What target gains",
    "valueForMatch": "What match gains"
  }
]
\`\`\``;try{const d=(await B(r)).response.text(),h=ue(d),f=Object.fromEntries(n.map(c=>[c.id,c]));return h.filter(c=>f[c.memberId]).map(c=>({...c,member:f[c.memberId]}))}catch{return n.slice(0,3).map((s,d)=>{var h;return{member:s,score:8-d,headline:`Synergy in ${((h=s.tags)==null?void 0:h[0])||"business"}`,reason:`${s.name} is in the ${s.stage} stage and offers experience in ${s.canHelp||s.role}.`}})}}async function Xt(e,t){try{const n=`Write a warm, concise WhatsApp outreach message from ${e.name} to ${t.name}.
From Business: ${e.business}
To Business: ${t.business}
Return ONLY the message text (3 sentences max).`;return(await B(n)).response.text().trim()}catch{return`Hi ${t.name}! I saw your profile in the Entrepreneurs Directory. I run ${e.business} and would love to connect about potential collaboration!`}}function en(){return`/**
 * Smart Entrepreneurs Directory — 2-Way Sync Webhook
 * 
 * Instructions:
 * 1. Open your Google Sheet linked to your Google Form.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Replace all code in Code.gs with this script.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type "Web app".
 * 6. Set "Execute as": "Me", and "Who has access": "Anyone".
 * 7. Click "Deploy", authorize access, and copy the Web App URL.
 * 8. Paste the Web App URL into the Smart Directory Admin Portal!
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ success: true, rows: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0].map(function(h) { return String(h).trim(); });
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var rowData = data[i];
    var obj = { sheetRowIndex: i + 1 };
    for (var j = 0; j < headers.length; j++) {
      var headerKey = normalizeHeader(headers[j]);
      obj[headerKey] = rowData[j] !== undefined ? rowData[j] : '';
    }
    rows.push(obj);
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    totalRows: rows.length,
    rows: rows,
    syncedAt: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents || '{}');
    var action = payload.action; // 'update' | 'delete' | 'add'
    var member = payload.member || {};
    var audit = payload.audit || {};
    var timestamp = new Date().toISOString();

    ensureAuditHeaders(sheet);

    var data = sheet.getDataRange().getValues();
    var headers = data[0].map(function(h) { return String(h).trim(); });
    var statusCol = headers.indexOf('App_Status') + 1;
    var syncAtCol = headers.indexOf('Last_App_Sync_At') + 1;
    var notesCol  = headers.indexOf('App_Notes') + 1;

    // Match row by sheetRowIndex, email, or name
    var targetRowIndex = -1;
    if (member.sheetRowIndex && member.sheetRowIndex <= data.length) {
      targetRowIndex = parseInt(member.sheetRowIndex, 10);
    } else {
      var nameCol = findColIndex(headers, ['Name', 'Full Name', 'Founder Name']);
      for (var i = 1; i < data.length; i++) {
        if (nameCol > -1 && String(data[i][nameCol]).trim().toLowerCase() === String(member.name || '').trim().toLowerCase()) {
          targetRowIndex = i + 1;
          break;
        }
      }
    }

    if (action === 'delete') {
      if (targetRowIndex > 1) {
        if (statusCol > 0) sheet.getRange(targetRowIndex, statusCol).setValue('DELETED');
        if (syncAtCol > 0) sheet.getRange(targetRowIndex, syncAtCol).setValue(timestamp);
        if (notesCol > 0)  sheet.getRange(targetRowIndex, notesCol).setValue(audit.reason || 'Deleted by Admin in Web App');
        sheet.getRange(targetRowIndex, 1, 1, headers.length).setBackground('#FFF1F2'); // Light red highlight
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        action: 'delete',
        row: targetRowIndex,
        timestamp: timestamp
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'update') {
      if (targetRowIndex > 1) {
        if (statusCol > 0) sheet.getRange(targetRowIndex, statusCol).setValue('EDITED_IN_APP');
        if (syncAtCol > 0) sheet.getRange(targetRowIndex, syncAtCol).setValue(timestamp);
        if (notesCol > 0)  sheet.getRange(targetRowIndex, notesCol).setValue(audit.notes || 'Updated by Admin in Web App');
        sheet.getRange(targetRowIndex, 1, 1, headers.length).setBackground('#F0FDF4'); // Light green highlight
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        action: 'update',
        row: targetRowIndex,
        timestamp: timestamp
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Action processed' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function ensureAuditHeaders(sheet) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h).trim(); });
  var required = ['App_Status', 'Last_App_Sync_At', 'App_Notes'];
  var lastCol = sheet.getLastColumn();

  for (var i = 0; i < required.length; i++) {
    var req = required[i];
    if (headers.indexOf(req) === -1) {
      lastCol++;
      sheet.getRange(1, lastCol).setValue(req).setFontWeight('bold').setBackground('#E2E8F0');
    }
  }
}

function findColIndex(headers, aliases) {
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i].toLowerCase();
    for (var j = 0; j < aliases.length; j++) {
      if (h.indexOf(aliases[j].toLowerCase()) > -1) return i;
    }
  }
  return -1;
}

function normalizeHeader(header) {
  var h = String(header || '').toLowerCase().trim();
  if (h.indexOf('timestamp') > -1) return 'formTimestamp';
  if (h.indexOf('email') > -1) return 'email';
  if (h.indexOf('phone') > -1 || h.indexOf('whatsapp') > -1 || h.indexOf('mobile') > -1) return 'phone';
  if (h.indexOf('linkedin') > -1) return 'linkedin';
  // Q9: "How long have you been running your business?" — MUST come before business check
  // because the header contains the word "business"
  if (h.indexOf('how long') > -1 || h.indexOf('been running') > -1 || h.indexOf('been in') > -1 ||
      h.indexOf('duration') > -1 || h.indexOf('years in') > -1 || h.indexOf('business age') > -1 ||
      h.indexOf('stage') > -1) return 'stage';
  if (h.indexOf('name') > -1 && h.indexOf('company') === -1 && h.indexOf('business') === -1) return 'name';
  if (h.indexOf('role') > -1 || h.indexOf('profession') > -1 || h.indexOf('title') > -1 || h.indexOf('do you do') > -1) return 'role';
  // Q5: "What are you currently looking for?" — MUST come before city check ("where are you")
  // "currently" removed from stage check to avoid false match here
  if (h.indexOf('looking for') > -1 || h.indexOf('seeking') > -1) return 'lookingFor';
  // Q6: "What can you offer to other members?"
  if (h.indexOf('offer') > -1 || h.indexOf('can help') > -1 || h.indexOf('offering') > -1) return 'canHelp';
  // Q7: "Business or Project Pitch"
  if (h.indexOf('business') > -1 || h.indexOf('project') > -1 || h.indexOf('pitch') > -1 || h.indexOf('venture') > -1 || h.indexOf('company') > -1) return 'business';
  if (h.indexOf('country') > -1) return 'country';
  // Q8: "Where are you based?" — "based" and "where are you" added
  if (h.indexOf('city') > -1 || h.indexOf('governorate') > -1 || h.indexOf('district') > -1 ||
      h.indexOf('where are you') > -1 || h.indexOf('based') > -1 || h.indexOf('location') > -1) return 'city';
  // Q10: "Industry (...)"
  if (h.indexOf('industry') > -1 || h.indexOf('tag') > -1 || h.indexOf('sector') > -1) return 'tags';
  if (h.indexOf('app_status') > -1) return 'appStatus';
  if (h.indexOf('last_app_sync_at') > -1) return 'lastAppSyncAt';
  if (h.indexOf('app_notes') > -1) return 'appNotes';
  return h.replace(/[^a-z0-9]/gi, '_');
}`}function Ke(e={}){if(!e||typeof e!="object")return null;const t=String(e.name||e.founderName||e.full_name||"").trim();if(!t)return null;const a=String(e.stage||e.businessAge||"").toLowerCase().replace(/[–—]/g,"-");let r="idea";a.includes("5+")||a.includes("3-5")||a.includes("3 to 5")?r="growing":a.includes("1-3")||a.includes("1 to 3")?r="running":a.includes("less than")||a.includes("under 1")||a.includes("under one")?r="starting":a.includes("idea")||a.includes("plan")||a.includes("💡")?r="idea":a.includes("grow")||a.includes("scale")||a.includes("series")?r="growing":a.includes("run")||a.includes("trad")||a.includes("revenue")||a.includes("seed")?r="running":(a.includes("start")||a.includes("mvp")||a.includes("early")||a.includes("launch"))&&(r="starting");let i=[];Array.isArray(e.tags)?i=e.tags:typeof e.tags=="string"&&e.tags.trim()&&(i=e.tags.split(/[,;|]/).map(m=>m.trim()).filter(Boolean));const o=String(e.country||"Egypt").trim(),u=String(e.city||"Cairo").trim(),s=e.formTimestamp||e.timestamp||"",d=e.sheetRowIndex||null,h=`sheet-row-${d||t.toLowerCase().replace(/[^a-z0-9]/g,"-")}`,f=(...m)=>{for(const w of m)if(e[w]!==void 0&&String(e[w]).trim())return String(e[w]).trim();for(const w of m){const b=Object.keys(e).find(l=>l.toLowerCase().includes(w.toLowerCase()));if(b&&String(e[b]).trim())return String(e[b]).trim()}return""},c=String(e.appStatus||"").toUpperCase().trim();let S="pending";return["APPROVED","ACTIVE","EDITED_IN_APP"].includes(c)?S="active":["REJECTED","DELETED"].includes(c)&&(S="rejected"),{id:h,sheetRowIndex:d,name:t,role:f("role","profession","title")||"Founder & CEO",business:f("business","pitch","project","venture","company"),stage:r,lookingFor:f("lookingFor","looking_for","seeking"),canHelp:f("canHelp","can_help","what_can_you_help","8__what_can_you_help"),location:{country:o,city:u},phone:f("phone","whatsapp","mobile"),linkedin:f("linkedin"),tags:i.length>0?i:["Startup"],appStatus:c||"PENDING",status:S,formTimestamp:s,createdAt:s?new Date(s).toISOString():new Date().toISOString(),updatedAt:new Date().toISOString(),isFromGoogleForm:!0}}async function tn(e){if(!e||!e.trim().startsWith("http"))throw new Error("Please provide a valid Google Apps Script Web App URL starting with https://");const t=await fetch(e.trim(),{method:"GET"});if(!t.ok)throw new Error(`Connection failed with HTTP status ${t.status}`);const n=await t.json();if(!n||typeof n!="object")throw new Error("Invalid JSON response from Google Apps Script Web App");return{success:!0,totalRows:n.totalRows||(Array.isArray(n.rows)?n.rows.length:0),data:n}}async function ze(){const e=_(),t=e.apiUrl;if(!t||!t.trim())return{success:!1,message:"Google Sheets API URL is not configured"};try{const n=await fetch(t.trim(),{method:"GET"});if(!n.ok)throw new Error(`HTTP Error ${n.status}`);const a=await n.json(),r=Array.isArray(a.rows)?a.rows:[],i=new Set(K()),o=x().filter(m=>m&&!String(m.id||"").startsWith("seed-")&&!m.isDemoSeed),u=new Map,s=new Map;o.forEach(m=>{m.name&&u.set(m.name.trim().toLowerCase(),m),m.id&&s.set(m.id,m),m.sheetRowIndex&&s.set(`sheet-row-${m.sheetRowIndex}`,m)});let d=0,h=0,f=0;const c=[...o];r.forEach(m=>{const w=Ke(m);if(!w)return;const b=w.name.toLowerCase(),l=`sheet-row-${w.sheetRowIndex}`;if(w.appStatus==="DELETED"||i.has(l)||i.has(b)||i.has(w.id)){f++;return}const g=u.get(b)||s.get(l)||s.get(w.id);if(g){if(g.locallyEdited)return;const C=c.findIndex(N=>N.id===g.id);C!==-1&&(c[C]={...g,...w,id:g.id,sheetRowIndex:w.sheetRowIndex||g.sheetRowIndex},h++)}else c.push(w),u.set(b,w),d++}),M(c);const S={success:!0,lastSyncAt:new Date().toISOString(),addedCount:d,updatedCount:h,ignoredTombstoneCount:f,totalRecords:c.length};return re({...e,lastSyncAt:S.lastSyncAt,lastSyncStatus:S}),S}catch(n){console.error("Google Sheets Sync Failed:",n);const a={success:!1,error:n.message,lastSyncAt:new Date().toISOString()};return re({...e,lastSyncStatus:a}),a}}async function nn(e,t="Deleted in Web App"){if(!e)return;const n=(e.name||"").trim().toLowerCase();n&&L(n),e.id&&L(e.id),e.sheetRowIndex&&L(`sheet-row-${e.sheetRowIndex}`);const a=_();if(!(!a.apiUrl||!a.apiUrl.trim()))try{await fetch(a.apiUrl.trim(),{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"delete",member:{id:e.id,name:e.name,sheetRowIndex:e.sheetRowIndex},audit:{reason:t||"Deleted in Web App by Admin",timestamp:new Date().toISOString()}})})}catch(r){console.warn("Failed to push deletion to Google Sheets webhook:",r)}}async function an(e,t={}){if(!e)return;const n=_();if(!(!n.apiUrl||!n.apiUrl.trim()))try{const a=Object.keys(t).filter(i=>t[i]!==e[i]),r=a.length>0?`Edited in Web App: ${a.join(", ")}`:"Updated in Web App";await fetch(n.apiUrl.trim(),{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"update",member:{id:e.id,name:t.name||e.name,sheetRowIndex:e.sheetRowIndex,role:t.role||e.role,business:t.business||e.business,stage:t.stage||e.stage,lookingFor:t.lookingFor||e.lookingFor,canHelp:t.canHelp||e.canHelp,phone:t.phone||e.phone,linkedin:t.linkedin||e.linkedin,tags:t.tags||e.tags},audit:{notes:r,timestamp:new Date().toISOString()}})})}catch(a){console.warn("Failed to push update to Google Sheets webhook:",a)}}async function rn({adminEmail:e}){const t=_();if(!t.apiUrl||!t.apiUrl.trim())return{success:!1,error:"No Apps Script URL configured"};try{return{success:!0,data:await(await fetch(t.apiUrl.trim(),{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"setConfig",config:{adminEmail:e||"",adminPortalUrl:"https://smart-entrepreneurs-directory.vercel.app/admin.html"}})})).json()}}catch(n){return console.warn("Failed to push admin config to Apps Script:",n),{success:!1,error:n.message}}}async function sn(e){const t=_();if(!(!t.apiUrl||!t.apiUrl.trim()))try{await fetch(t.apiUrl.trim(),{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"update",member:{id:e.id,name:e.name,sheetRowIndex:e.sheetRowIndex},audit:{notes:"APPROVED by Admin in Web App",timestamp:new Date().toISOString()},appStatus:"APPROVED"})})}catch(n){console.warn("Failed to push approval to Google Sheets:",n)}}async function on(e,t="Rejected by Admin"){const n=_();if(!(!n.apiUrl||!n.apiUrl.trim()))try{await fetch(n.apiUrl.trim(),{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:"delete",member:{id:e.id,name:e.name,sheetRowIndex:e.sheetRowIndex},audit:{reason:t,timestamp:new Date().toISOString()},appStatus:"REJECTED"})})}catch(a){console.warn("Failed to push rejection to Google Sheets:",a)}}const ge=p.createContext(null),fe=p.createContext(null),me=p.createContext(null);function cn({children:e}){const[t,n]=p.useState(x),[a,r]=p.useState("dashboard"),[i,o]=p.useState(ae),[u,s]=p.useState(Ue),[d,h]=p.useState(Be),[f,c]=p.useState(!1),[S,m]=p.useState(null),[w,b]=p.useState(""),[l,g]=p.useState("all"),[C,N]=p.useState("grid"),z=p.useCallback(()=>{U(),n(x())},[]),V=p.useMemo(()=>t.filter(A=>!A.status||A.status==="active"),[t]);p.useEffect(()=>{document.documentElement.classList.toggle("dark",i),u&&ie(u),Fe().then(R=>{R&&Array.isArray(R.members)&&n(R.members),ze().then(D=>{D&&D.success&&(U(),n(x()))}).catch(()=>{})});const A=R=>{if((!R.key||R.key===y.MEMBERS)&&(U(),n(x())),R.key===y.DARK_MODE){const D=ae();o(D),document.documentElement.classList.toggle("dark",D)}},E=()=>{U(),n(x())};return window.addEventListener("storage",A),window.addEventListener("sed_storage_updated",E),()=>{window.removeEventListener("storage",A),window.removeEventListener("sed_storage_updated",E)}},[]);const q=p.useCallback(()=>{o(A=>{const E=!A;return $e(E),document.documentElement.classList.toggle("dark",E),E})},[]),Y=p.useCallback(A=>{je(A),s(A),ie(A)},[]),Q=p.useCallback(A=>{const E=He(A);h(E)},[]),Z=p.useCallback((A,E="success")=>{m({message:A,type:E}),setTimeout(()=>m(null),3500)},[]),ye=p.useMemo(()=>({members:t,activeMembers:V,setMembersState:n,refreshMembers:z}),[t,V,z]),Se=p.useMemo(()=>({activeTab:a,setActiveTab:r,darkMode:i,toggleDarkMode:q,apiKey:u,updateApiKey:Y,mapConfig:d,updateMapConfig:Q,sidebarOpen:f,setSidebarOpen:c,notification:S,notify:Z}),[a,i,q,u,Y,d,Q,f,S,Z]),we=p.useMemo(()=>({searchQuery:w,setSearchQuery:b,stageFilter:l,setStageFilter:g,viewMode:C,setViewMode:N}),[w,l,C]);return O.jsx(ge.Provider,{value:ye,children:O.jsx(fe.Provider,{value:Se,children:O.jsx(me.Provider,{value:we,children:e})})})}function Ve(){const e=p.useContext(ge);if(!e)throw new Error("useMembers must be used within AppProvider");return e}function qe(){const e=p.useContext(fe);if(!e)throw new Error("useUI must be used within AppProvider");return e}function Ye(){const e=p.useContext(me);if(!e)throw new Error("useFilters must be used within AppProvider");return e}function ln(){const e=Ve(),t=qe(),n=Ye();return{...e,...t,...n}}const $="sed_admin_session",Qe=1800*1e3;function dn(){try{const e=sessionStorage.getItem($);if(!e)return!1;const{grantedAt:t}=JSON.parse(e);return Date.now()-t>Qe?(sessionStorage.removeItem($),!1):!0}catch{return!1}}function un(){sessionStorage.setItem($,JSON.stringify({grantedAt:Date.now()}))}function pn(){sessionStorage.removeItem($)}function hn({isOpen:e,onClose:t,title:n,children:a,size:r="md",hideClose:i=!1}){if(p.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),!e)return null;const o={sm:"max-w-md",md:"max-w-2xl",lg:"max-w-4xl",xl:"max-w-6xl",full:"max-w-full mx-4"}[r]||"max-w-2xl";return O.jsxs("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4",children:[O.jsx("div",{className:"absolute inset-0 bg-stone-950/60 backdrop-blur-sm",onClick:t}),O.jsxs("div",{className:`relative w-full ${o} bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 animate-slide-up max-h-[90vh] flex flex-col`,children:[(n||!i)&&O.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex-shrink-0",children:[n&&O.jsx("h2",{className:"text-base font-bold text-stone-900 dark:text-stone-100",children:n}),!i&&O.jsx("button",{onClick:t,className:"ml-auto p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors","aria-label":"Close dialog",children:O.jsx(Ne,{size:18})})]}),O.jsx("div",{className:"overflow-y-auto flex-1 p-6",children:a})]})]})}export{un as $,Ft as A,sn as B,it as C,ot as D,on as E,Jt as F,_t as G,Gt as H,jt as I,Wt as J,ct as K,Te as L,lt as M,Bt as N,dn as O,ae as P,$t as Q,ut as R,pt as S,ft as T,yt as U,Fe as V,cn as W,gt as X,dt as Y,$e as Z,Lt as _,K as a,Oe as a0,tt as a1,Ne as a2,At as a3,St as a4,xt as a5,vt as a6,It as a7,Dt as a8,wt as a9,bt as aa,Tt as ab,an as ac,Ct as ad,le as ae,Et as af,Mt as ag,Ut as ah,nn as ai,Nt as aj,Yt as ak,Qt as al,Pt as am,Zt as an,Xt as ao,nt as ap,Vt as b,k as c,rt as d,at as e,kt as f,_ as g,Ht as h,Ot as i,O as j,mt as k,ht as l,hn as m,st as n,en as o,pn as p,ze as q,p as r,re as s,tn as t,ln as u,Rt as v,Kt as w,zt as x,qt as y,rn as z};
