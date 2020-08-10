import React from 'react';
import "firebase/auth";
import "firebase/firestore";

class HomepageFeature extends React.Component{
    constructor(props){
        super(props);
        this.slideContainer = React.createRef();
        this.handleSlide = this.handleSlide.bind(this);
        this.state={
            dotMotivatedStyle: '#F54F29',
            dotOriginalStyle: '#dddddd',
            singleSlideSize: null
        }
    }
    handleSingleSlideSize(callback){
        let size = this.slideContainer.current.childNodes[0].childNodes[0].clientWidth;
        this.setState({
            singleSlideSize: size
        }, callback);
    }
    // initSlide(){}
    handleSlide(){
        // this.handleSingleSlideSize(initSlide);
        let counter = 0;
        let slideContainer = this.slideContainer.current;
        let slider = slideContainer.childNodes[0];
        let slideDots = slideContainer.childNodes[1].childNodes;
        let size = slider.childNodes[0].clientWidth;
        let initSize = size/2;
        slideDots[0].style.backgroundColor = this.state.dotMotivatedStyle;
        slideContainer.style.maxWidth = size*3+'px';
        slider.style.transform = 'translateX('+(-initSize)+'px)';
        let plusSlides = (n)=>{
            slideDots.forEach(item=>{
                item.style.backgroundColor = this.state.dotOriginalStyle;
            })
            let dotnumber = n+1;
            if(n===3){dotnumber=0}
            if(n===4){dotnumber=1}
            slideDots[dotnumber].style.backgroundColor = this.state.dotMotivatedStyle;
            if(n!==4){
                slider.style.transition = 'transform 1s ease-in-out'
                slider.style.transform = 'translateX('+(-(size*(counter+1)+initSize))+'px)';
                counter+=1;
            }else if(n===4){
                slider.style.transition = 'none'
                slider.style.transform = 'translateX('+(-initSize)+'px)';
                window.setTimeout(function(){
                    counter = 0;
                    plusSlides(counter);
                }, 0);
            }
        }
        setInterval(()=>{plusSlides(counter)}, 3000);
        // let counter = 0;
        // let slideContainer = this.slideContainer.current;
        // let slider = slideContainer.childNodes[0];
        // let slideDots = slideContainer.childNodes[1].childNodes;
        // let size = slider.childNodes[0].clientWidth;
        // let initSize = size/2;
        // slideDots[0].style.backgroundColor = this.state.dotMotivatedStyle;
        // slideContainer.style.maxWidth = size*3+'px';
        // slider.style.transform = 'translateX('+(-initSize)+'px)';
        // let plusSlides = (n)=>{
        //     slideDots.forEach(item=>{
        //         item.style.backgroundColor = this.state.dotOriginalStyle;
        //     })
        //     let dotnumber = n+1;
        //     if(n===3){dotnumber=0}
        //     if(n===4){dotnumber=1}
        //     slideDots[dotnumber].style.backgroundColor = this.state.dotMotivatedStyle;
        //     if(n!==4){
        //         slider.style.transition = 'transform 1s ease-in-out'
        //         slider.style.transform = 'translateX('+(-(size*(counter+1)+initSize))+'px)';
        //         counter+=1;
        //     }else if(n===4){
        //         slider.style.transition = 'none'
        //         slider.style.transform = 'translateX('+(-initSize)+'px)';
        //         window.setTimeout(function(){
        //             counter = 0;
        //             plusSlides(counter);
        //         }, 0);
        //     }
        // }
        // setInterval(()=>{plusSlides(counter)}, 3000)
    }
    render(){
        return  <div className="section2" id="nav-features">
            <main>
                <div className="title">Features</div>
                <div id="slide-container" ref={this.slideContainer}>
                    <div id="homepage-slide" className="slide">
                        <div><img className='img1' src="/images/collaborate.png" /><div>Collaborative</div></div>
                        <div><img className='img2' src="/images/format.png" /><div>Format Docs</div></div>
                        <div><img className='img3' src="/images/share-docs.png" /><div>Shareable</div></div>
                        <div><img className='img4' src="/images/chat.png" /><div>Live Chat</div></div>
                        {/* clone */}
                        <div className="clone"><img className='img1' src="/images/collaborate.png" /><div>Collaborative</div></div>
                        <div className="clone"><img className='img2' src="/images/format.png" /><div>Format Docs</div></div>
                        <div className="clone"><img className='img3' src="/images/share-docs.png" /><div>Shareable</div></div>
                        <div className="clone"><img className='img4' src="/images/chat.png" /><div>Live Chat</div></div>
                    </div>
                    <div id="slide-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </main>
        </div>
    }
    componentDidMount(){
        window.addEventListener('load', this.handleSlide())
    }
    componentWillUnmount(){
        window.removeEventListener('load', this.handleSlide)
    }
}

export {HomepageFeature};