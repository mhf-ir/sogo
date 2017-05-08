!function(){"use strict";function a(b){if("function"!=typeof b.then)if(this.init(b),this.name&&!this.id){var c=a.$$resource.create("createFolder",this.name);this.$unwrap(c),this.acls={objectEditor:1,objectCreator:1,objectEraser:1}}else this.id&&(this.$acl=new a.$$Acl("Contacts/"+this.id));else this.$unwrap(b)}a.$factory=["$q","$timeout","$log","sgSettings","sgAddressBook_PRELOAD","Resource","Card","Acl","Preferences",function(b,c,d,e,f,g,h,i,j){return angular.extend(a,{$q:b,$timeout:c,$log:d,PRELOAD:f,$$resource:new g(e.activeUser("folderURL")+"Contacts",e.activeUser()),$Card:h,$$Acl:i,$Preferences:j,$query:{search:"name_or_address",value:"",sort:"c_cn",asc:1},activeUser:e.activeUser(),selectedFolder:null,$refreshTimeout:null}),j.ready().then(function(){j.settings.Contact.SortingState&&(a.$query.sort=j.settings.Contact.SortingState[0],a.$query.asc=parseInt(j.settings.Contact.SortingState[1]))}),a}];try{angular.module("SOGo.ContactsUI")}catch(a){angular.module("SOGo.ContactsUI",["SOGo.Common","SOGo.PreferencesUI"])}angular.module("SOGo.ContactsUI").constant("sgAddressBook_PRELOAD",{LOOKAHEAD:50,SIZE:100}).factory("AddressBook",a.$factory),a.$filterAll=function(b,c,d){var e={search:b};return b?(angular.isUndefined(a.$cards)&&(a.$cards=[]),angular.extend(e,c),a.$$resource.fetch(null,"allContactSearch",e).then(function(c){var e,f,g,h=function(a){return this.id==a.id};for(e=d?_.filter(c.contacts,function(a){return _.isUndefined(_.find(d,_.bind(h,a)))}):c.contacts,g=a.$cards.length-1;g>=0;g--)f=a.$cards[g],_.isUndefined(_.find(e,_.bind(h,f)))&&a.$cards.splice(g,1);return _.forEach(e,function(c,d){if(_.isUndefined(_.find(a.$cards,_.bind(h,c)))){var e=new a.$Card(_.mapKeys(c,function(a,b){return b.toLowerCase()}),b);a.$cards.splice(d,0,e)}}),a.$log.debug(a.$cards),a.$cards})):(a.$cards=[],a.$q.when(a.$cards))},a.$add=function(a){var b,c,d;b=a.isSubscription?this.$subscriptions:this.$addressbooks,c=_.find(b,function(b){return"personal"==a.id||"personal"!=b.id&&1===b.name.localeCompare(a.name)}),d=c?_.indexOf(_.map(b,"id"),c.id):1,b.splice(d,0,a)},a.$findAll=function(b){var c=this;return b&&(this.$addressbooks=[],this.$subscriptions=[],this.$remotes=[],angular.forEach(b,function(b,d){var e=new a(b);e.isRemote?c.$remotes.push(e):e.isSubscription?c.$subscriptions.push(e):c.$addressbooks.push(e)})),_.union(this.$addressbooks,this.$subscriptions,this.$remotes)},a.$subscribe=function(b,c){var d=this;return a.$$resource.userResource(b).fetch(c,"subscribe").then(function(b){var c=new a(b);return _.isUndefined(_.find(d.$subscriptions,function(a){return a.id==b.id}))&&a.$add(c),c})},a.$reloadAll=function(){var b=this;return a.$$resource.fetch("addressbooksList").then(function(c){_.forEach(c.addressbooks,function(c){var d,e;d=c.isRemote?b.$remotes:c.owner!=a.activeUser.login?b.$subscriptions:b.$addressbooks,e=_.find(d,function(a){return a.id==c.id}),e&&e.init(c)})})},a.prototype.init=function(b,c){var d=this;this.$$cards||(this.$$cards=[]),this.idsMap={},this.$cards=[],angular.forEach(b,function(a,b){"headers"!=b&&"cards"!=b&&(d[b]=a)}),this.isOwned=a.activeUser.isSuperUser||this.owner==a.activeUser.login,this.isSubscription=!this.isRemote&&this.owner!=a.activeUser.login},a.prototype.$id=function(){return this.id?a.$q.when(this.id):this.$futureAddressBookData.then(function(a){return a.id})},a.prototype.getLength=function(){return this.$cards.length},a.prototype.getItemAtIndex=function(a){var b;return!this.$isLoading&&a>=0&&a<this.$cards.length&&(b=this.$cards[a],this.$lastVisibleIndex=Math.max(0,a-3),this.$loadCard(b))?b:null},a.prototype.$loadCard=function(b){var c,d,e,f,g=b.id,h=this.idsMap[g],i=this.$cards.length,j=!1;if(angular.isUndefined(this.ids)&&b.id)j=!0;else if(angular.isDefined(h)&&h<this.$cards.length&&(b.$loaded!=a.$Card.STATUS.NOT_LOADED&&(j=!0),c=Math.min(h+a.PRELOAD.LOOKAHEAD,i-1),this.$cards[c].$loaded!=a.$Card.STATUS.NOT_LOADED?(d=Math.max(h-a.PRELOAD.LOOKAHEAD,0),this.$cards[d].$loaded!=a.$Card.STATUS.LOADED&&(c=h,h=Math.max(h-a.PRELOAD.SIZE,0))):c=Math.min(h+a.PRELOAD.SIZE,i-1),this.$cards[h].$loaded==a.$Card.STATUS.NOT_LOADED||this.$cards[c].$loaded==a.$Card.STATUS.NOT_LOADED)){for(e=[];h<c&&h<i;h++)this.$cards[h].$loaded!=a.$Card.STATUS.NOT_LOADED?c++:(e.push(this.$cards[h].id),this.$cards[h].$loaded=a.$Card.STATUS.LOADING);a.$log.debug("Loading Ids "+e.join(" ")+" ("+e.length+" cards)"),e.length>0&&(f=a.$$resource.post(this.id,"headers",{ids:e}),this.$unwrapHeaders(f))}return j},a.prototype.hasSelectedCard=function(){return angular.isDefined(this.selectedCard)},a.prototype.isSelectedCard=function(a){return this.hasSelectedCard()&&this.selectedCard==a},a.prototype.$selectedCard=function(){var a=this;return _.find(this.$cards,function(b){return b.id==a.selectedCard})},a.prototype.$selectedCardIndex=function(){return _.indexOf(_.map(this.$cards,"id"),this.selectedCard)},a.prototype.$selectedCards=function(){return _.filter(this.$cards,function(a){return a.selected})},a.prototype.$selectedCount=function(){var a;return a=0,this.$cards&&(a=_.filter(this.$cards,function(a){return a.selected}).length),a},a.prototype.$startRefreshTimeout=function(){var b=this;a.$refreshTimeout&&a.$timeout.cancel(a.$refreshTimeout),a.$Preferences.ready().then(function(){var c=a.$Preferences.defaults.SOGoRefreshViewCheck;if(c&&"manually"!=c){var d=angular.bind(b,a.prototype.$reload);a.$refreshTimeout=a.$timeout(d,1e3*c.timeInterval())}})},a.prototype.$reload=function(){return this.$startRefreshTimeout(),this.$filter()},a.prototype.$filter=function(b,c,d){var e,f=this,g=c&&c.dry;return g?e=angular.copy(a.$query):(this.$isLoading=!0,e=a.$query,this.isRemote||(e.partial=1)),a.$Preferences.ready().then(function(){return c&&(angular.extend(e,c),g&&!b)?(f.$$cards=[],a.$q.when(f.$$cards)):(angular.isDefined(b)&&(e.value=b),f.$id().then(function(c){var h=a.$$resource.fetch(c,"view",e);return g?h.then(function(e){var g,h,i,j,k,l=f.$$cards,m=function(a){return this==a.id};for(e.headers&&(j=_.invokeMap(e.headers[0],"toLowerCase"),k=j.indexOf("id"),e.headers.splice(0,1)),g=d?_.filter(e.ids,function(a){return _.isUndefined(_.find(d,_.bind(m,a)))}):e.ids,i=l.length-1;i>=0;i--)h=l[i],_.isUndefined(_.find(g,_.bind(m,h.id)))&&l.splice(i,1);return _.forEach(g,function(d,e){if(_.isUndefined(_.find(l,_.bind(m,d)))){var f={pid:c,id:d},g=new a.$Card(f,b);l.splice(e,0,g)}}),_.forEach(g,function(a,b){var c,d;l[b].id!=a&&(c=_.findIndex(l,_.bind(m,a)),d=l.splice(c,1),l.splice(b,0,d[0]))}),_.forEach(e.headers,function(a){var c,d=_.findIndex(l,_.bind(m,a[k]));d>-1&&(c=_.zipObject(j,a),l[d].init(c,b))}),l}):f.$unwrap(h)}))})},a.prototype.$rename=function(b){var c,d;return d=this.isSubscription?a.$subscriptions:a.$addressbooks,c=_.indexOf(_.map(d,"id"),this.id),this.name=b,d.splice(c,1),a.$add(this),this.$save()},a.prototype.$delete=function(){var b,c,d=this,e=a.$q.defer();return this.isSubscription?(c=a.$$resource.fetch(this.id,"unsubscribe"),b=a.$subscriptions):(c=a.$$resource.remove(this.id),b=a.$addressbooks),c.then(function(){var a=_.indexOf(_.map(b,"id"),d.id);b.splice(a,1),e.resolve()},e.reject),e.promise},a.prototype.$_deleteCards=function(a){var b=this;_.forEachRight(this.$cards,function(c,d){var e=_.findIndex(a,function(a){return c.id==a});e>-1?(a.splice(e,1),delete b.idsMap[c.id],b.isSelectedCard(c.id)&&delete b.selectedCard,b.$cards.splice(d,1)):b.idsMap[c.id]-=a.length})},a.prototype.$deleteCards=function(b){var c=this,d=_.map(b,"id");return a.$$resource.post(this.id,"batchDelete",{uids:d}).then(function(){c.$_deleteCards(d)})},a.prototype.$copyCards=function(b,c){var d=_.map(b,"id");return a.$$resource.post(this.id,"copy",{uids:d,folder:c})},a.prototype.$moveCards=function(b,c){var d,e=this;return d=_.map(b,"id"),a.$$resource.post(this.id,"move",{uids:d,folder:c}).then(function(){return e.$_deleteCards(d)})},a.prototype.$save=function(){return a.$$resource.save(this.id,this.$omit()).then(function(a){return a})},a.prototype.exportCards=function(b){var c,d,e=null;return c={type:"application/octet-stream",filename:this.name+".ldif"},b&&(d=_.filter(this.$cards,function(a){return a.selected}),e={uids:_.map(d,"id")}),a.$$resource.download(this.id,"export",e,c)},a.prototype.$unwrap=function(b){var c=this;this.$isLoading=!0,this.$futureAddressBookData=b.then(function(b){return a.$timeout(function(){var d;return(!b.ids||c.$topIndex>b.ids.length-1)&&(c.$topIndex=0),angular.forEach(a.$findAll(),function(a,d){a.id==b.id&&angular.extend(c,a)}),c.init(b),c.ids&&(a.$log.debug("unwrapping "+c.ids.length+" cards"),_.reduce(c.ids,function(b,d,e){var f={pid:c.id,id:d};return c.idsMap[f.id]=e,b.push(new a.$Card(f)),b},c.$cards)),b.headers&&(d=_.invokeMap(b.headers[0],"toLowerCase"),b.headers.splice(0,1),c.ids?_.forEach(b.headers,function(a){var b=_.zipObject(d,a),e=c.idsMap[b.id];c.$cards[e].init(b)}):(c.$cards=[],angular.forEach(b.headers,function(b){var e=_.zipObject(d,b);angular.extend(e,{pid:c.id}),c.$cards.push(new a.$Card(e))}))),c.$acl=new a.$$Acl("Contacts/"+c.id),c.$startRefreshTimeout(),c.$isLoading=!1,a.$log.debug("addressbook "+c.id+" ready"),c})},function(b){c.isError=!0,angular.isObject(b)&&a.$timeout(function(){angular.extend(c,b)})})},a.prototype.$unwrapHeaders=function(b){var c=this;b.then(function(b){a.$timeout(function(){var a,d;b.length>0&&(a=_.invokeMap(b[0],"toLowerCase"),b.splice(0,1),_.forEach(b,function(b){b=_.zipObject(a,b),d=c.idsMap[b.id],angular.isDefined(d)&&c.$cards[d].init(b)}))})})},a.prototype.$omit=function(){var a={};return angular.forEach(this,function(b,c){"constructor"!=c&&"acls"!=c&&"ids"!=c&&"idsMap"!=c&&"urls"!=c&&"$"!=c[0]&&(a[c]=b)}),a}}(),function(){"use strict";function a(b,c){if("function"!=typeof b.then){if(this.init(b,c),this.pid&&!this.id){var d=a.$$resource.newguid(this.pid);this.$unwrap(d),this.isNew=!0}}else this.$unwrap(b)}a.$TEL_TYPES=["work","home","cell","fax","pager"],a.$EMAIL_TYPES=["work","home","pref"],a.$URL_TYPES=["work","home","pref"],a.$ADDRESS_TYPES=["work","home"],a.$factory=["$timeout","sgSettings","sgCard_STATUS","Resource","Preferences",function(b,c,d,e,f){return angular.extend(a,{STATUS:d,$$resource:new e(c.activeUser("folderURL")+"Contacts",c.activeUser()),$timeout:b,$Preferences:f}),f.ready().then(function(){f.defaults.SOGoContactsCategories&&(a.$categories=f.defaults.SOGoContactsCategories),f.defaults.SOGoAlternateAvatar&&(a.$alternateAvatar=f.defaults.SOGoAlternateAvatar)}),a}];try{angular.module("SOGo.ContactsUI")}catch(a){angular.module("SOGo.ContactsUI",["SOGo.Common","SOGo.PreferencesUI"])}angular.module("SOGo.ContactsUI").constant("sgCard_STATUS",{NOT_LOADED:0,DELAYED_LOADING:1,LOADING:2,LOADED:3,DELAYED_MS:300}).factory("Card",a.$factory),a.$find=function(b,c){var d=this.$$resource.fetch([b,c].join("/"),"view");return c?new a(d):a.$unwrapCollection(d)},a.filterCategories=function(b){var c=new RegExp(b,"i");return _.map(_.filter(a.$categories,function(a){return a.search(c)!=-1}),function(a){return{value:a}})},a.$unwrapCollection=function(b){var c={};return c.$futureCardData=b,b.then(function(b){a.$timeout(function(){angular.forEach(b,function(b,d){c[b.id]=new a(b)})})}),c},a.prototype.init=function(b,c){var d=this;this.refs=[],this.categories=[],this.c_screenname=null,angular.extend(this,b),this.$$fullname||(this.$$fullname=this.$fullname()),this.$$email||(this.$$email=this.$preferredEmail(c)),this.$$image||(this.$$image=this.image),this.$$image||a.$Preferences.avatar(this.$$email,32,{no_404:!0}).then(function(a){d.$$image=a}),this.hasphoto&&(this.photoURL=a.$$resource.path(this.pid,this.id,"photo")),this.isgroup&&(this.c_component="vlist"),this.$avatarIcon=this.$isList()?"group":"person",b.orgs&&b.orgs.length&&(this.orgs=_.map(b.orgs,function(a){return{value:a}})),b.notes&&b.notes.length?this.notes=_.map(b.notes,function(a){return{value:a}}):this.notes&&this.notes.length||(this.notes=[{value:""}]),angular.forEach(["addresses","phones","urls"],function(a){angular.forEach(d[a],function(a){a.type&&(a.type=a.type.toLowerCase())})}),angular.forEach(this.refs,function(b,c){b.email&&(b.emails=[{value:b.email}]),b.id=b.reference,d.refs[c]=new a(b)}),this.birthday&&a.$Preferences.ready().then(function(){var b=a.$Preferences.$mdDateLocaleProvider;d.birthday=d.birthday.parseDate(b,"%Y-%m-%d"),d.$birthday=b.formatDate(d.birthday)}),this.$loaded=angular.isDefined(this.c_name)?a.STATUS.LOADED:a.STATUS.NOT_LOADED,this.empty=" "},a.prototype.$id=function(){return this.$futureCardData.then(function(a){return a.id})},a.prototype.$isLoading=function(){return this.$loaded==a.STATUS.LOADING},a.prototype.$reload=function(){var b;return this.$futureCardData?this:(b=a.$$resource.fetch([this.pid,this.id].join("/"),"view"),this.$unwrap(b))},a.prototype.$save=function(){var b=this,c="saveAsContact";return"vlist"==this.c_component&&(c="saveAsList",_.forEach(this.refs,function(a){a.reference=a.id})),a.$$resource.save([this.pid,this.id||"_new_"].join("/"),this.$omit(),{action:c}).then(function(c){return b.birthday&&(b.$birthday=a.$Preferences.$mdDateLocaleProvider.formatDate(b.birthday)),b.$shadowData=b.$omit(!0),c})},a.prototype.$delete=function(b,c){return b?void(c>-1&&this[b].length>c?this[b].splice(c,1):delete this[b]):a.$$resource.remove([this.pid,this.id].join("/"))},a.prototype.export=function(){var b,c;return b={uids:[this.id]},c={type:"application/octet-stream",filename:this.$$fullname+".ldif"},a.$$resource.download(this.pid,"export",b,c)},a.prototype.$fullname=function(a){var b,c,d=this.c_cn||"",e=a&&a.html;return 0===d.length&&(c=[],this.c_givenname&&this.c_givenname.length>0&&c.push(this.c_givenname),this.nickname&&this.nickname.length>0&&c.push((e?"<em>":"")+this.nickname+(e?"</em>":"")),this.c_sn&&this.c_sn.length>0&&c.push(this.c_sn),c.length>0?d=c.join(" "):this.org&&this.org.length>0?d=this.org:this.emails&&this.emails.length>0&&(b=_.find(this.emails,function(a){return""!==a.value}),b&&(d=b.value))),this.contactinfo&&(d+=" ("+this.contactinfo.split("\n").join("; ")+")"),d},a.prototype.$description=function(){var a=[];return this.title&&a.push(this.title),this.role&&a.push(this.role),this.org&&a.push(this.org),this.orgs&&(a=_.concat(a,_.map(this.orgs,"value"))),this.description&&a.push(this.description),a.join(", ")},a.prototype.$preferredEmail=function(a){var b,c;return a&&(c=new RegExp(a,"i"),b=_.find(this.emails,function(a){return c.test(a.value)})),b?b=b.value:(b=_.find(this.emails,function(a){return"pref"==a.type}),b=b?b.value:this.emails&&this.emails.length?this.emails[0].value:this.c_mail&&this.c_mail.length?this.c_mail[0]:""),b},a.prototype.$shortFormat=function(a){var b=[this.$$fullname],c=this.$preferredEmail(a);return c&&c!=this.$$fullname&&b.push(" <"+c+">"),b.join(" ")},a.prototype.$isCard=function(){return"vcard"==this.c_component},a.prototype.$isList=function(a){var b=!a||!a.expandable||a.expandable&&!this.isgroup;return"vlist"==this.c_component&&b},a.prototype.$addOrg=function(a){return angular.isUndefined(this.orgs)?this.orgs=[a]:a==this.org||_.includes(this.orgs,a)||this.orgs.push(a),this.orgs.length-1},a.prototype.$addEmail=function(a){return angular.isUndefined(this.emails)?this.emails=[{type:a,value:""}]:_.isUndefined(_.find(this.emails,function(a){return""===a.value}))&&this.emails.push({type:a,value:""}),this.emails.length-1},a.prototype.$addScreenName=function(a){this.c_screenname=a},a.prototype.$addPhone=function(a){return angular.isUndefined(this.phones)?this.phones=[{type:a,value:""}]:_.isUndefined(_.find(this.phones,function(a){return""===a.value}))&&this.phones.push({type:a,value:""}),this.phones.length-1},a.prototype.$addUrl=function(a,b){return angular.isUndefined(this.urls)?this.urls=[{type:a,value:b}]:_.isUndefined(_.find(this.urls,function(a){return a.value==b}))&&this.urls.push({type:a,value:b}),this.urls.length-1},a.prototype.$addAddress=function(a,b,c,d,e,f,g,h){return angular.isUndefined(this.addresses)?this.addresses=[{type:a,postoffice:b,street:c,street2:d,locality:e,region:f,country:g,postalcode:h}]:_.find(this.addresses,function(a){return a.street==c&&a.street2==d&&a.locality==e&&a.country==g&&a.postalcode==h})||this.addresses.push({type:a,postoffice:b,street:c,street2:d,locality:e,region:f,country:g,postalcode:h}),this.addresses.length-1},a.prototype.$addMember=function(b){var c,d=new a({email:b,emails:[{value:b}]});if(angular.isUndefined(this.refs))this.refs=[d];else if(0===b.length)this.refs.push(d);else{for(c=0;c<this.refs.length&&this.refs[c].email!=b;c++);c==this.refs.length&&this.refs.push(d)}return this.refs.length-1},a.prototype.explode=function(){var b,c=[];return this.emails.length>1?(b=this.$omit(),_.forEach(this.emails,function(d){var e=new a(angular.extend({},b,{emails:[d]}));c.push(e)}),c):[this]},a.prototype.$reset=function(){var a=this;angular.forEach(this,function(b,c){"constructor"!=c&&"$"!=c[0]&&delete a[c]}),this.init(this.$shadowData),this.$shadowData=this.$omit(!0)},a.prototype.$unwrap=function(b){var c=this;return this.$loaded=a.STATUS.DELAYED_LOADING,a.$timeout(function(){c.$loaded!=a.STATUS.LOADED&&(c.$loaded=a.STATUS.LOADING)},a.STATUS.DELAYED_MS),this.$futureCardData=b.then(function(b){return c.init(b),c.$loaded=a.STATUS.LOADED,c.$shadowData=c.$omit(!0),c}),this.$futureCardData},a.prototype.$omit=function(b){var c={};return angular.forEach(this,function(a,d){"refs"==d?c.refs=_.map(a,function(a){return a.$omit(b)}):"constructor"!=d&&"$"!=d[0]&&(b?c[d]=angular.copy(a):c[d]=a)}),b||(c.birthday?c.birthday=c.birthday.format(a.$Preferences.$mdDateLocaleProvider,"%Y-%m-%d"):c.birthday=""),this.orgs&&(c.orgs=_.map(this.orgs,"value")),this.notes&&(c.notes=_.map(this.notes,"value")),c},a.prototype.toString=function(){var a=this.id+" "+this.$$fullname;return this.$$email&&(a+=" <"+this.$$email+">"),"["+a+"]"}}();
//# sourceMappingURL=Contacts.services.js.map