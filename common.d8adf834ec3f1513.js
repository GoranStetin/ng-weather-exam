"use strict";(self.webpackChunkng_weather=self.webpackChunkng_weather||[]).push([[592],{4056:(m,C,r)=>{r.d(C,{a:()=>_});var d=r(5125),l=r(2679);let _=(()=>{class u{constructor(){this.locations=[],this.locationsSubject=new d.X([]),this.locations$=this.locationsSubject.asObservable();for(let i=0;i<localStorage.length;i++){let a=localStorage.key(i);a&&a.startsWith("current-conditions-")&&(a=a.replace("current-conditions-",""),this.locations.push(a))}this.locationsSubject.next(this.locations)}addLocation(i){this.locations.includes(i)||(this.locations.push(i),this.locationsSubject.next(this.locations))}removeLocation(i){this.locations=this.locations.filter(g=>g!==i),localStorage.removeItem("current-conditions-"+i),this.locationsSubject.next(this.locations)}static#t=this.\u0275fac=function(a){return new(a||u)};static#n=this.\u0275prov=l.Yz7({token:u,factory:u.\u0275fac,providedIn:"root"})}return u})()},8986:(m,C,r)=>{r.d(C,{F:()=>D});var d=r(5125),l=r(9193),_=r(7504),u=r(5222),f=r(7927),i=r(2413),a=r(2679),g=r(1474),p=r(4056);let D=(()=>{class e{static#t=this.URL="http://api.openweathermap.org/data/2.5";static#n=this.APPID="5a4b2d457ecbef9eb2a71e480b947604";static#o=this.ICON_URL="https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";constructor(t,n){this.http=t,this.locationService=n,this.currentConditionsSubject=new d.X([]),this.currentConditions$=this.currentConditionsSubject.asObservable(),this.cacheDuration=72e5,this.locationService.locations$.subscribe(s=>{this.loadCachedData(s)}),this.locationService.locations$.pipe((0,u.w)(s=>{const o=this.currentConditionsSubject.getValue().map(c=>c.zip),h=s.filter(c=>!o.includes(c)).map(c=>this.addCurrentConditions(c)),E=o.filter(c=>!s.includes(c)).map(c=>(0,l.of)(this.removeCurrentConditions(c)));return(0,_.D)([...h,...E])})).subscribe()}loadCachedData(t){const n=[];t.forEach(s=>{const o=this.getCachedCurrentConditions(s);o&&n.push({zip:s,data:o})}),n.length>0&&this.currentConditionsSubject.next(n)}setCacheDuration(t){this.cacheDuration=t}getCachedCurrentConditions(t){const n=`current-conditions-${t}`,s=localStorage.getItem(n);if(s){const o=JSON.parse(s);if((new Date).getTime()-o.timestamp<this.cacheDuration)return o.data;localStorage.removeItem(n)}return null}cacheCurrentConditions(t,n){const s=`current-conditions-${t}`,o={timestamp:(new Date).getTime(),data:n};localStorage.setItem(s,JSON.stringify(o))}addCurrentConditions(t){const n=this.getCachedCurrentConditions(t);return n?(0,l.of)(n):this.http.get(`${e.URL}/weather?zip=${t},us&units=imperial&APPID=${e.APPID}`).pipe((0,f.b)(s=>{this.cacheCurrentConditions(t,s);let o=this.currentConditionsSubject.getValue();o=[...o,{zip:t,data:s}],this.currentConditionsSubject.next(o)}),(0,i.K)(s=>(console.error(`Error fetching conditions for ${t}:`,s),(0,l.of)(null))))}getForecast(t){const n=`forecast-${t}`,s=localStorage.getItem(n);if(s){const o=JSON.parse(s);if((new Date).getTime()-o.timestamp<this.cacheDuration)return(0,l.of)(o.data);localStorage.removeItem(n)}return this.http.get(`${e.URL}/forecast/daily?zip=${t},us&units=imperial&cnt=5&APPID=${e.APPID}`).pipe((0,f.b)(o=>{const h={timestamp:(new Date).getTime(),data:o};localStorage.setItem(n,JSON.stringify(h))}),(0,i.K)(o=>(console.error(`Error fetching forecast for ${t}:`,o),(0,l.of)(null))))}removeCurrentConditions(t){this.currentConditionsSubject.next(this.currentConditionsSubject.getValue().filter(n=>n.zip!==t))}getWeatherIcon(t){return t>=200&&t<=232?e.ICON_URL+"art_storm.png":t>=501&&t<=511?e.ICON_URL+"art_rain.png":500===t||t>=520&&t<=531?e.ICON_URL+"art_light_rain.png":t>=600&&t<=622?e.ICON_URL+"art_snow.png":t>=801&&t<=804?e.ICON_URL+"art_clouds.png":741===t||761===t?e.ICON_URL+"art_fog.png":e.ICON_URL+"art_clear.png"}static#s=this.\u0275fac=function(n){return new(n||e)(a.LFG(g.eN),a.LFG(p.a))};static#e=this.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})()}}]);