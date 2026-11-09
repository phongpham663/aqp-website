let main = {modules:{}}

class contactFormModule {
    fields = {};
    constructor(selector,action,fieldNames){
        this.el = document.querySelector(selector);
        this.action = action;
        var current = this;

        if (this.el==null){ return false;}
        fieldNames.forEach((fieldName)=>{
            this.fields[fieldName] = this.el.querySelector('.' + fieldName); 
        });
        this.el.addEventListener('submit',(event)=>{
            this.submit(event);
        });
        for (const [key, value] of Object.entries(this.fields)) {
            value.addEventListener('focusout', function() {
                current.validate();
            })
        }
        
    }
    submit(event){
        if (this.validate()){
            this.send();
        }
        event.preventDefault();
    }

    async send(){
        let ajaxUrl = '/wp-admin/admin-ajax.php',
            formData = new FormData(this.el);
        formData.append('action',this.action);

        for (const [name, field] of formData.entries()) {
            console.log([name,field]);
        }
        let response = await fetch(ajaxUrl, {method: 'post',body: formData });
        response = await response.text();
        if (response=='success'){
            console.log(magalVars);
            window.location = magalVars['thankYouUrl'];
        } else {
            alert('error, please try again');
        }
    }
    validate(){
        let valid = true;
        for (const [name, field] of Object.entries(this.fields)) {
            let fieldValid = field.value != '';
            if (name == 'email'){
                let emailValid = field.value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                fieldValid = emailValid ? fieldValid:false;
            }
            let func = fieldValid ? 'remove' : 'add';
            field.parentElement.classList[func]('invalid');
            valid = fieldValid ? valid : false;
        }
        return valid;
    }
}

main.modules.subscribe = new contactFormModule('#subscribe-form','subscribe_smoove',['name','phone','email']);
main.modules.contact = new contactFormModule('#contact-form','contact_smoove',[
    'name','last_name','email','phone','company'
]);


ready(function(){
    var navAnchors = __('.anchor-link a'),
        numbers = __('.hp-num span'),
        hpMainNums = _('.hp-nums-wrapper'),
        topTxtBlocksWrapper = _('.hp-cards'),
        topTxtBlocks = __('.hp-card .txt'),
        submenuLinks = __('.header-nav>li>.sub-menu>li>a + ul li'),
        submenuTitles = __('.header-nav>li>.sub-menu>li>a'),
        delay = 1,
        customCounter = 1,
        isMobile = window.innerWidth < 1024, 
        interval = 1000,
        steps = __('.step'),
        fnExecuted = false,
        submenus = __('.header-nav>li.menu-item-has-children');

        var animTitle = _('.top-content h1');
        var animTitle2 = _('.tech-v1-top h1');
        var animSubTitle = _('.top-content h3');
        
        if( animTitle2 &&  isElementXPercentInViewport(animTitle2, 20)  ){
            setTimeout(function(){
            animTitle2.classList.add('anim-to-zero')
            },500);
        }
        if( animTitle &&  isElementXPercentInViewport(animTitle, 20)  ){
            setTimeout(function(){
            animTitle.classList.add('anim-to-zero')
            },500);
        }
        
        if( animSubTitle &&  isElementXPercentInViewport(animSubTitle, 20)  ){
            setTimeout(function(){
                animSubTitle.classList.add('anim-to-zero')
            },500);
        }


    function animateStep(el, counter){

        setTimeout(function(){

            el[counter].classList.add('active');
 
        }, interval * customCounter);

        setTimeout(function(){

            el[counter].classList.remove('active');

        }, interval * ++customCounter);
    }

 
    function animateAllSteps(){
 
        if( ! fnExecuted ){

            for (i = 0; i < steps.length; i++) {

                    animateStep(steps, i);
                    customCounter++;

            }
            fnExecuted = true;

        }

    }

    if( isElementXPercentInViewport(_('.steps-wrapper'), 100)  ){
            animateAllSteps();
    }


    

    var 
    items = __('.hp-top h1 span'),
    firstNum = 2,
    fadeTime = 6000,
    totalItems = items.length;

    function resetTitles(){

        items.forEach(function(item){

            item.classList.remove('active')

        })

    }

    function changeTitle(num) {
    var 
        //seting a dynamic current variable
        currTitle = _('.hp-top h1 span:nth-child(' + firstNum + ')');

        if(firstNum >= 4){
            
            firstNum = 1;        
            return changeTitle(totalItems);
        }
        else{

            setTimeout(function(){

                resetTitles();

                currTitle.classList.add('active'); 
                firstNum++;
                num--;
                return changeTitle(num);
            },fadeTime);
        }
 
    }

    if( _('.vid-txt-1') ){

        changeTitle(totalItems);

    }



    document.documentElement.scrollTop === 0 ? _('.header').classList.remove('scroll') : _('.header').classList.add('scroll');

    _('.header').classList.add('scroll');

    document.onscroll = function(){

        if( hpMainNums && ! hpMainNums.classList.contains('animated') && isElementXPercentInViewport(hpMainNums, 50) && numbers ){


            for (number of numbers) {

                animateValue(number)
                
            }
            hpMainNums.classList.add('animated');
        }

        /*--init anim onscroll--*/
        if(topTxtBlocks) var hpAnimtopTxtBlocks = animateElems(topTxtBlocksWrapper, topTxtBlocks, 50);

        if( isElementXPercentInViewport(_('.steps-wrapper'), 100) ) animateAllSteps(); 
    }

    document.querySelectorAll('.mgmt-btn').forEach(function (elem) {

        elem.addEventListener('click', function(){
    
            let currPersonIndex = this.parentElement.getAttribute('person-index');
     
            document.querySelectorAll('.mgmt-pesonal-txt').forEach(function (e) {
    
                e.classList.remove('active')
            })
    
             if(_('.mgmt-pesonal-txt-wrapper').classList.contains('active')){
                 _('.mgmt-pesonal-txt-wrapper').classList.remove('active');
             }else{
                 _('.mgmt-pesonal-txt-wrapper').classList.add('active')
                 _('.mgmt-person-text[person-txt-index="' + currPersonIndex + '"]').classList.add('active');
             }
    
        })
        
    });
    document.querySelectorAll('.close-x').forEach(function(el){
        el.addEventListener('click', function(){
            document.querySelectorAll('.mgmt-person-text').forEach(function (e) {
                _('.mgmt-pesonal-txt-wrapper').scrollTop = 0;
                e.classList.remove('active');
                document.querySelector('.mgmt-pesonal-txt-wrapper').classList.remove('active');

            });
        })
    });


    if(document.querySelector('.mgmt-pesonal-txt-wrapper')){
        
        document.querySelector('.mgmt-pesonal-txt-wrapper').addEventListener('click', function(evt){

            if (!evt.target.closest(".mgmt-person-text.active")) {

                document.querySelectorAll('.mgmt-pesonal-txt').forEach(function (e) {

                    e.classList.remove('active');
                    document.querySelector('.mgmt-pesonal-txt-wrapper').classList.remove('active');
                    
                });
            }
        });

    }


    if( ! isMobile ){
        navAnchors.forEach(function(elem){

            elem.addEventListener('click', function(e){
                e.preventDefault();
                let currLink = e.target.href,
                    theAnchor = currLink.split('#')[1];
        
                document.querySelector( '#' + theAnchor ).scrollIntoView({ behavior: "smooth", block: "start", inline: "block" });
            })
        })
    }else{
        animateAllSteps();
    }
 
    var humburger = _('.header-humburger-wrapper');
    if(humburger.length !== 0){
        humburger.addEventListener('click',function(e){
            let humburgerLines = __('.header-humburger'),
                menuMob = _('.header-menu-wrapper');
                
            if(this.classList.contains('open')){
                this.classList.remove('open');
                for (line of humburgerLines) {
                    line.classList.remove('open');
                    line.classList.add('close');
                }
                menuMob.classList.remove('open');
                }else{
                    this.classList.add('open');
                    for (line of humburgerLines) {
                        line.classList.remove('close');
                        line.classList.add('open');
                    }   
                    menuMob.classList.add('open');
                }

        });
    } 
 
    if( submenus !== null ){
        for (submenu of submenus) {
            submenu.addEventListener('click', function(e){
                var self = this,
                    currMenu = self.querySelector('.sub-menu-wrap'),
                    currMenuH = currMenu.scrollHeight;

                    // self.querySelectorAll('.sub-menu').forEach(function(submenu) {
                    //     submenu.setAttribute('style','')
                    // });

                    // console.log(currMenu)
 
                    if(currMenu.getAttribute('style')){
                        currMenu.classList.remove('open');
                        //self.parentNode.classList.remove('open');
                        currMenu.setAttribute('style','')
                    }else{
                        currMenu.classList.add('open');
                        //self.parentNode.classList.add('open');
                        currMenu.setAttribute('style', 'max-height:' + currMenuH + 'px');
                    }
                    
            });
        }
    }
});
window.addEventListener("load", function(e) {
    if(document.body.classList.contains('home')) {
        let videoEl = document.querySelector('.hp-top video');
        videoEl.src = videoEl.dataset.src;

				let topbannerClose = document.querySelector('.header-top-close');
				if(topbannerClose){
					topbannerClose.addEventListener('click', function(){
						document.body.classList.add('top-banner-closed');
					})
				}

				let videoPopupBtn = document.querySelector('.hero-video-btn');
				if(videoPopupBtn){
					videoPopupBtn.addEventListener('click', function(e){
						e.preventDefault();
						let parent = videoPopupBtn.parentNode
						let popup = parent.querySelector('.popup')
						let iframe = document.querySelector('.hero-popup-iframe').innerHTML
						if(popup && iframe){
							popup.classList.add('active');
							popup.querySelector('.iframe-wrapper').innerHTML = iframe
						}
					})
				}
    }
});

document.addEventListener("scroll", function () {
    let header = document.querySelector(".header.scroll");
    
    if (window.scrollY > 20) {
        header.classList.add("active");
    } else {
        header.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const careersContainer = document.querySelector(".careers");

    if (!careersContainer) return;

    function updateJobCount() {
        const items = careersContainer.querySelectorAll('.comeet-positions-list li');
        const count = items.length;

        const counterElement = document.querySelector('.jobs-total-count');
        if (counterElement) {
            counterElement.textContent = count;
        }
    }

    const observer = new MutationObserver(() => {
        updateJobCount();
    });

    observer.observe(careersContainer, { childList: true, subtree: true });

    updateJobCount();
});