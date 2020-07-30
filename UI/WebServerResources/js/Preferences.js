!function(){"use strict";function e(e,t){e.state("preferences",{abstract:!0,views:{preferences:{templateUrl:"preferences.html",controller:"PreferencesController",controllerAs:"app"}}}).state("preferences.general",{url:"/general",views:{module:{templateUrl:"generalPreferences.html"}}}).state("preferences.calendars",{url:"/calendars",views:{module:{templateUrl:"calendarsPreferences.html"}}}).state("preferences.addressbooks",{url:"/addressbooks",views:{module:{templateUrl:"addressbooksPreferences.html"}}}).state("preferences.mailer",{url:"/mailer",views:{module:{templateUrl:"mailerPreferences.html"}}}),t.rules.otherwise("/general")}function t(e,t,s,a){e.DebugEnabled||a.defaultErrorHandler(function(){}),s.onError({to:"preferences.**"},function(e){"preferences"==e.to().name||e.ignored()||(t.error("transition error to "+e.to().name+": "+e.error().detail),a.go({state:"preferences"}))})}angular.module("SOGo.PreferencesUI",["ui.router","sgCkeditor","angularFileUpload","SOGo.Common","SOGo.MailerUI","SOGo.ContactsUI","SOGo.Authentication","as.sortable"]).config(e).run(t),e.$inject=["$stateProvider","$urlServiceProvider"],t.$inject=["$window","$log","$transitions","$state"]}(),function(){"use strict";function e(i,e,t,s,a,r,n,o,c,d,f){var u=this;function h(){u.account.security&&u.account.security.hasCertificate&&u.account.$certificate().then(function(e){u.certificate=e},function(){delete u.account.security.hasCertificate})}function p(e){var t=0<e.type.indexOf("pkcs12")||/\.(p12|pfx)$/.test(e.name);return u.form.certificateFilename.$setValidity("fileformat",t),t}this.defaultPort=143,this.defaults=o,this.account=c,this.accountId=d,this.hostnameRE=0<d?/^(?!(127\.0\.0\.1|localhost(?:\.localdomain)?)$)/:/./,this.addressesSearchText="",this.emailSeparatorKeys=[t.KEY_CODE.ENTER,t.KEY_CODE.TAB,t.KEY_CODE.COMMA,t.KEY_CODE.SEMICOLON],this.ckConfig={autoGrow_minHeight:70,toolbar:[["Bold","Italic","-","Link","Font","FontSize","-","TextColor","BGColor","Source"]],language:o.LocaleCode},this.account.encryption?"ssl"==this.account.encryption&&(this.defaultPort=993):this.account.encryption="none",h(),this.uploader=new a({url:[n.activeUser("folderURL")+"Mail",d,"importCertificate"].join("/"),autoUpload:!1,queueLimit:1,filters:[{name:p,fn:p}],onAfterAddingFile:function(e){u.certificateFilename=e.file.name},onSuccessItem:function(e,t,s,a){this.clearQueue(),i(function(){_.assign(u.account,{security:{hasCertificate:!0},$$certificate:t})}),h()},onErrorItem:function(e,t,s,a){r.alert(l("Error"),l("An error occurred while importing the certificate. Verify your password."))}}),this.hasIdentities=function(){return 0<_.filter(this.account.identities,u.isEditableIdentity).length},this.isEditableIdentity=function(e){return!e.isReadOnly},this.selectIdentity=function(e){this.selectedIdentity==e?this.selectedIdentity=null:this.selectedIdentity=e},this.setDefaultIdentity=function(e,s){return _.forEach(this.account.identities,function(e,t){t==s?e.isDefault=!e.isDefault:delete e.isDefault}),e.stopPropagation(),!1},this.canRemoveIdentity=function(e){return e==this.selectedIdentity&&1<this.account.identities.length},this.removeIdentity=function(e){this.account.identities.splice(e,1),this.selectedIdentity=null},this.addIdentity=function(){var e=_.findIndex(this.account.identities,{isReadOnly:1}),t={};e<0&&(e=this.account.identities.length),this.customFromIsReadonly()&&(t.fullName=this.account.identities[0].fullName),this.account.identities.splice(Math.max(e,0),0,t),this.selectedIdentity=e},this.showCkEditor=function(e){return this.selectedIdentity==e&&"html"==this.defaults.SOGoMailComposeMessageType},this.filterEmailAddresses=function(t){return _.filter(e.defaultEmailAddresses,function(e){return 0<=e.toLowerCase().indexOf(t.toLowerCase())})},this.customFromIsReadonly=function(){return!(0<d)&&!f},this.importCertificate=function(){this.uploader.queue[0].formData=[{password:this.certificatePassword}],this.uploader.uploadItem(0)},this.onBeforeUploadCertificate=function(e){this.form=e,this.uploader.clearQueue()},this.removeCertificate=function(){this.account.$removeCertificate()},this.cancel=function(){s.cancel()},this.save=function(){s.hide()}}e.$inject=["$timeout","$window","$mdConstant","$mdDialog","FileUploader","Dialog","sgSettings","defaults","account","accountId","mailCustomFromEnabled"],angular.module("SOGo.PreferencesUI").controller("AccountDialogController",e)}(),function(){"use strict";function e(e,t,s,a,i,r,n,o,c){var d=t.sieveCapabilities,f=t.forwardEnabled;t.vacationEnabled;this.filter=i,this.mailboxes=r,this.labels=n,this.fieldLabels={subject:l("Subject"),from:l("From"),to:l("To"),cc:l("Cc"),to_or_cc:l("To or Cc"),size:l("Size (Kb)"),header:l("Header")},-1<d.indexOf("body")&&(this.fieldLabels.body=l("Body")),this.methodLabels={discard:l("Discard the message"),keep:l("Keep the message"),stop:l("Stop processing filter rules")},f&&(this.methodLabels.redirect=l("Forward the message to")),-1<d.indexOf("reject")&&(this.methodLabels.reject=l("Send a reject message")),-1<d.indexOf("fileinto")&&(this.methodLabels.fileinto=l("File the message in")),(-1<d.indexOf("imapflags")||-1<d.indexOf("imap4flags"))&&(this.methodLabels.addflag=l("Flag the message with")),this.numberOperatorLabels={under:l("is under"),over:l("is over")},this.textOperatorLabels={is:l("is"),is_not:l("is not"),contains:l("contains"),contains_not:l("does not contain"),matches:l("matches"),matches_not:l("does not match")},-1<d.indexOf("regex")&&(this.textOperatorLabels.regex=l("matches regex"),this.textOperatorLabels.regex_not=l("does not match regex")),this.cancel=function(){s.cancel()},this.hasRulesAndActions=function(){var e=[this.filter.actions];return"allmessages"!=this.filter.match&&e.push(this.filter.rules),_.every(e,function(e){return e&&0<e.length})},this.save=function(e){if(this.invalid=!1,this.filter.actions)try{_.forEach(_.filter(this.filter.actions,{method:"redirect"}),function(e){o(e.argument)})}catch(e){return this.invalid=e.message,!1}s.hide()},this.addMailFilterRule=function(e){this.filter.rules||(this.filter.rules=[]),this.filter.rules.push({field:"subject",operator:"contains"})},this.removeMailFilterRule=function(e){this.filter.rules.splice(e,1)},this.addMailFilterAction=function(e){this.filter.actions||(this.filter.actions=[]),this.filter.actions.push({method:"discard"})},this.removeMailFilterAction=function(e){this.filter.actions.splice(e,1)}}e.$inject=["$scope","$window","$mdDialog","Dialog","filter","mailboxes","labels","validateForwardAddress","Preferences"],angular.module("SOGo.PreferencesUI").controller("FiltersDialogController",e)}(),function(){"use strict";function e(r,n,s,e,a,i,o,c,d,f,u,h,p,m,t){var g=this,C=[];(new Date).beginOfDay();function w(){var a;C.length||d.activeUser("path").mail&&(a=new p({id:0})).$getMailboxes().then(function(){for(var e=a.$flattenMailboxes({all:!0}),t=-1,s=e.length;++t<s;)C.push(e[t])})}function y(e){var t,s,a;if(s=[],0<n.forwardConstraints&&angular.isDefined(m.defaults.Forward)&&m.defaults.Forward.enabled&&angular.isDefined(m.defaults.Forward.forwardAddress)){if(t=n.defaultEmailAddresses,_.forEach(t,function(e){var t=e.split("@")[1];t&&s.push(t.toLowerCase())}),a=e.split("@")[1].toLowerCase(),s.indexOf(a)<0&&1==n.forwardConstraints)throw new Error(l("You are not allowed to forward your messages to an external email address."));if(0<=s.indexOf(a)&&2==n.forwardConstraints)throw new Error(l("You are not allowed to forward your messages to an internal email address."));if(2==n.forwardConstraints&&0<n.forwardConstraintsDomains.length&&n.forwardConstraintsDomains.indexOf(a)<0)throw new Error(l("You are not allowed to forward your messages to this domain:")+" "+a)}return!0}this.$onInit=function(){this.preferences=m,this.passwords={newPassword:null,newPasswordConfirmation:null,oldPassword:null},this.timeZonesList=n.timeZonesList,this.timeZonesSearchText="",this.sieveVariablesCapability=0<=n.sieveCapabilities.indexOf("variables"),this.addressesSearchText="",this.mailLabelKeyRE=new RegExp(/^(?!^_\$)[^(){} %*\"\\\\]*?$/),this.emailSeparatorKeys=[e.KEY_CODE.ENTER,e.KEY_CODE.TAB,e.KEY_CODE.COMMA,e.KEY_CODE.SEMICOLON],m.defaults.SOGoAlternateAvatar&&(h.$alternateAvatar=m.defaults.SOGoAlternateAvatar),this.preferences.hasActiveExternalSieveScripts(),this.updateVacationDates()},this.go=function(e,t){t.$valid&&(a("gt-md")||i("left").close(),s.go("preferences."+e))},this.onLanguageChange=function(e){e.$valid&&u.confirm(l("Warning"),l("Save preferences and reload page now?"),{ok:l("Yes"),cancel:l("No")}).then(function(){g.save(e,{quick:!0}).then(function(){n.location.reload(!0)})})},this.onDesktopNotificationsChange=function(){this.preferences.defaults.SOGoDesktopNotifications&&this.preferences.authorizeNotifications()},this.resetContactsCategories=function(e){this.preferences.defaults.SOGoContactsCategories=n.defaultContactsCategories,e.$setDirty()},this.resetCalendarCategories=function(e){this.preferences.defaults.SOGoCalendarCategories=_.keys(n.defaultCalendarCategories),this.preferences.defaults.SOGoCalendarCategoriesColorsValues=_.values(n.defaultCalendarCategories),e.$setDirty()},this.addCalendarCategory=function(e){var t=_.indexOf(this.preferences.defaults.SOGoCalendarCategories,l("New category"));t<0&&(this.preferences.defaults.SOGoCalendarCategories.push(l("New category")),this.preferences.defaults.SOGoCalendarCategoriesColorsValues.push("#aaa"),e.$setDirty(),t=this.preferences.defaults.SOGoCalendarCategories.length-1),f("calendarCategory_"+t)},this.resetCalendarCategoryValidity=function(e,t){t["calendarCategory_"+e].$setValidity("duplicate",!0)},this.removeCalendarCategory=function(e,t){this.preferences.defaults.SOGoCalendarCategories.splice(e,1),this.preferences.defaults.SOGoCalendarCategoriesColorsValues.splice(e,1),t.$setDirty()},this.addContactCategory=function(e){var t=_.indexOf(this.preferences.defaults.SOGoContactsCategories,"");t<0&&(this.preferences.defaults.SOGoContactsCategories.push(""),t=this.preferences.defaults.SOGoContactsCategories.length-1),f("contactCategory_"+t),e.$setDirty()},this.removeContactCategory=function(e,t){this.preferences.defaults.SOGoContactsCategories.splice(e,1),t.$setDirty()},this.addMailAccount=function(e,t){var s,a;a=this.preferences.defaults.AuxiliaryMailAccounts.length,s=new p({id:a,isNew:!0,name:"",identities:[{fullName:"",email:""}],receipts:{receiptAction:"ignore",receiptNonRecipientAction:"ignore",receiptOutsideDomainAction:"ignore",receiptAnyAction:"ignore"}}),o.show({controller:"AccountDialogController",controllerAs:"$AccountDialogController",templateUrl:"editAccount?account=new",targetEvent:e,locals:{defaults:this.preferences.defaults,account:s,accountId:a,mailCustomFromEnabled:n.mailCustomFromEnabled}}).then(function(){angular.isArray(g.preferences.settings.Mail.ExpandedFolders)||(g.preferences.settings.Mail.ExpandedFolders=["/0"]),g.preferences.settings.Mail.ExpandedFolders.push("/"+a),g.preferences.defaults.AuxiliaryMailAccounts.push(s.$omit()),t.$setDirty()})},this.editMailAccount=function(e,t,s){var a,i;a=_.assign({id:t},_.cloneDeep(this.preferences.defaults.AuxiliaryMailAccounts[t])),i=new p(a),o.show({controller:"AccountDialogController",controllerAs:"$AccountDialogController",templateUrl:"editAccount?account="+t,targetEvent:e,locals:{defaults:this.preferences.defaults,account:i,accountId:t,mailCustomFromEnabled:n.mailCustomFromEnabled}}).then(function(){g.preferences.defaults.AuxiliaryMailAccounts[t]=i.$omit(),s.$setDirty()}).catch(_.noop)},this.removeMailAccount=function(e,t){this.preferences.defaults.AuxiliaryMailAccounts.splice(e,1),t.$setDirty()},this.resetMailLabelValidity=function(e,t){t["mailIMAPLabel_"+e].$setValidity("duplicate",!0)},this.addMailLabel=function(e){guid();this.preferences.defaults.SOGoMailLabelsColorsKeys.push("label"),this.preferences.defaults.SOGoMailLabelsColorsValues.push(["New label","#aaa"]),f("mailLabel_"+(_.size(this.preferences.defaults.SOGoMailLabelsColorsKeys)-1)),e.$setDirty()},this.removeMailLabel=function(e,t){this.preferences.defaults.SOGoMailLabelsColorsKeys.splice(e,1),this.preferences.defaults.SOGoMailLabelsColorsValues.splice(e,1),t.$setDirty()},this.addMailFilter=function(e,t){var s={match:"all",active:1};w(),o.show({templateUrl:"editFilter?filter=new",controller:"FiltersDialogController",controllerAs:"filterEditor",targetEvent:e,locals:{filter:s,mailboxes:C,labels:this.preferences.defaults.SOGoMailLabelsColors,validateForwardAddress:y}}).then(function(){g.preferences.defaults.SOGoSieveFilters||(g.preferences.defaults.SOGoSieveFilters=[]),g.preferences.defaults.SOGoSieveFilters.push(s),t.$setDirty()})},this.editMailFilter=function(e,t,s){var a=angular.copy(this.preferences.defaults.SOGoSieveFilters[t]);w(),o.show({templateUrl:"editFilter?filter="+t,controller:"FiltersDialogController",controllerAs:"filterEditor",targetEvent:null,locals:{filter:a,mailboxes:C,labels:this.preferences.defaults.SOGoMailLabelsColors,validateForwardAddress:y}}).then(function(){g.preferences.defaults.SOGoSieveFilters[t]=a,s.$setDirty()},_.noop)},this.removeMailFilter=function(e,t){this.preferences.defaults.SOGoSieveFilters.splice(e,1),t.$setDirty()},this.onFiltersOrderChanged=function(t){return this._onFiltersOrderChanged||(this._onFiltersOrderChanged=function(e){t.$setDirty()}),this._onFiltersOrderChanged},this.filterEmailAddresses=function(t){return _.filter(_.difference(n.defaultEmailAddresses,this.preferences.defaults.Vacation.autoReplyEmailAddresses),function(e){return 0<=e.toLowerCase().indexOf(t.toLowerCase())})},this.addDefaultEmailAddresses=function(e){var t=[];angular.isDefined(this.preferences.defaults.Vacation.autoReplyEmailAddresses)&&(t=this.preferences.defaults.Vacation.autoReplyEmailAddresses),this.preferences.defaults.Vacation.autoReplyEmailAddresses=_.union(n.defaultEmailAddresses,t),e.$setDirty()},this.userFilter=function(e,t){return!e||e.length<d.minimumSearchLength()?[]:h.$filter(e,t).then(function(e){return _.forEach(e,function(e){e.$$image||(e.image?e.$$image=e.image:e.$$image=g.preferences.avatar(e.c_email,40,{no_404:!0}))}),e})},this.manageSieveScript=function(e){this.preferences.hasActiveExternalSieveScripts(!1),e.$setDirty()},this.confirmChanges=function(e,t){var s;if(t.$dirty&&t.$valid){for(e.preventDefault(),e.stopPropagation(),s=e.target;"A"!=s.tagName;)s=s.parentNode;u.confirm(l("Unsaved Changes"),l("Do you want to save your changes made to the configuration?"),{ok:l("Save"),cancel:l("Don't Save")}).then(function(){g.save(t,{quick:!0}).then(function(){n.location=s.href})},function(){n.location=s.href})}},this.save=function(a,t){var e,i,s;if(i=!0,this.preferences.defaults.Forward&&this.preferences.defaults.Forward.forwardAddress){s=this.preferences.defaults.Forward.forwardAddress;try{for(e=0;e<s.length;e++)y(s[e])}catch(e){u.alert(l("Error"),e),i=!1}}return this.preferences.defaults.SOGoMailLabelsColorsKeys.length==this.preferences.defaults.SOGoMailLabelsColorsValues.length&&this.preferences.defaults.SOGoMailLabelsColorsKeys.length==_.uniq(this.preferences.defaults.SOGoMailLabelsColorsKeys).length||(u.alert(l("Error"),l("IMAP labels must have unique names.")),_.forEach(this.preferences.defaults.SOGoMailLabelsColorsKeys,function(e,t,s){a["mailIMAPLabel_"+t].$dirty&&(s.indexOf(e)!=t||-1<s.indexOf(e,t+1))&&(a["mailIMAPLabel_"+t].$setValidity("duplicate",!1),i=!1)})),this.preferences.defaults.SOGoCalendarCategories.length!=_.uniq(this.preferences.defaults.SOGoCalendarCategories).length&&(u.alert(l("Error"),l("Calendar categories must have unique names.")),_.forEach(this.preferences.defaults.SOGoCalendarCategories,function(e,t,s){a["calendarCategory_"+t].$dirty&&(s.indexOf(e)!=t||-1<s.indexOf(e,t+1))&&(a["calendarCategory_"+t].$setValidity("duplicate",!1),i=!1)})),this.preferences.defaults.SOGoContactsCategories.length!=_.uniq(this.preferences.defaults.SOGoContactsCategories).length&&(u.alert(l("Error"),l("Contact categories must have unique names.")),_.forEach(this.preferences.defaults.SOGoContactsCategories,function(e,t,s){a["contactCategory_"+t].$dirty&&(s.indexOf(e)!=t||-1<s.indexOf(e,t+1))&&(a["contactCategory_"+t].$setValidity("duplicate",!1),i=!1)})),i?this.preferences.$save().then(function(e){t&&t.quick||(c.show(c.simple().content(l("Preferences saved")).position("bottom right").hideDelay(2e3)),a.$setPristine())}):r.reject("Invalid form")},this.canChangePassword=function(e){return this.passwords.newPasswordConfirmation&&this.passwords.newPasswordConfirmation.length&&this.passwords.newPassword!=this.passwords.newPasswordConfirmation?(e.newPasswordConfirmation.$setValidity("newPasswordMismatch",!1),!1):(e.newPasswordConfirmation.$setValidity("newPasswordMismatch",!0),!!(this.passwords.newPassword&&0<this.passwords.newPassword.length&&this.passwords.newPasswordConfirmation&&this.passwords.newPasswordConfirmation.length&&this.passwords.newPassword==this.passwords.newPasswordConfirmation&&this.passwords.oldPassword&&0<this.passwords.oldPassword.length))},this.changePassword=function(){t.changePassword(this.passwords.newPassword,this.passwords.oldPassword).then(function(){var e=o.alert({title:l("Password"),content:l("The password was changed successfully."),ok:l("OK")});o.show(e).finally(function(){e=void 0})},function(e){var t=o.alert({title:l("Password"),content:e,ok:l("OK")});o.show(t).finally(function(){t=void 0})})},this.timeZonesListFilter=function(t){return _.filter(this.timeZonesList,function(e){return 0<=e.toUpperCase().indexOf(t.toUpperCase())})},this.updateVacationDates=function(){var e=this.preferences.defaults;e&&e.Vacation&&e.Vacation.enabled&&(this.toggleVacationStartDate(),this.toggleVacationEndDate())},this.toggleVacationStartDate=function(){var e;(e=this.preferences.defaults.Vacation).startDateEnabled&&(e.startDate||(e.startDate=new Date),e.endDateEnabled&&e.endDate&&e.startDate.getTime()>e.endDate.getTime()&&(e.startDate=new Date(e.endDate.getTime()),e.startDate.addDays(-1)))},this.toggleVacationEndDate=function(){var e;(e=this.preferences.defaults.Vacation).endDateEnabled&&(e.endDate||(e.endDate=new Date),e.startDateEnabled&&e.startDate&&e.endDate.getTime()<e.startDate.getTime()&&(e.endDate=new Date(e.startDate.getTime()),e.endDate.addDays(1)))},this.validateVacationStartDate=function(e){var t=g.preferences.defaults,s=!0;return t&&t.Vacation&&t.Vacation.enabled&&t.Vacation.startDateEnabled&&(s=!t.Vacation.endDateEnabled||!t.Vacation.endDate||e.getTime()<=t.Vacation.endDate.getTime()),s},this.validateVacationEndDate=function(e){var t=g.preferences.defaults,s=!0;return t&&t.Vacation&&t.Vacation.enabled&&t.Vacation.endDateEnabled&&(s=!t.Vacation.startDateEnabled||!t.Vacation.startDate||e.getTime()>=t.Vacation.startDate.getTime()),s}}e.$inject=["$q","$window","$state","$mdConstant","$mdMedia","$mdSidenav","$mdDialog","$mdToast","sgSettings","sgFocus","Dialog","User","Account","Preferences","Authentication"],angular.module("SOGo.PreferencesUI").controller("PreferencesController",e)}();
//# sourceMappingURL=Preferences.js.map