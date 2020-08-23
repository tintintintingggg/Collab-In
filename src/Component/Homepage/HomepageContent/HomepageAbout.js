import React from "react";

class HomepageAbout extends React.Component{
  constructor(props){
    super(props);
    this.aboutContainer = React.createRef();
    this.handleScroll = this.handleScroll.bind(this);
  }
  addClassOnscroll(el){
    el.childNodes.forEach((item)=>{
      let rect = item.childNodes[0].getBoundingClientRect();
      if(rect.top >= 0 && rect.bottom-200 <= (window.innerHeight || document.documentElement.clientHeight)){
        item.classList.add("section3-main-in-viewport");
      }
    });
  }
  handleScroll(){
    this.addClassOnscroll(this.aboutContainer.current);
  }
  render(){
    return <div className="section3" id="nav-about" ref={this.aboutContainer}>
      <main className="section3-main">
        <article>
          <p>Co-working</p>
          <main>More efficient, more flexible</main>
          <div>Just click a share button and everything is there! Collab-In provides a shared platform where you could collaborate with team members for projects or assignments in any time and in any places!</div>
        </article>
        <div>
          <img src="/images/co-working.png" />
        </div>
      </main>
      <main className="section3-main  section3-main-middle ">
        <div>
          <img src="/images/edit-text.jpg" />
        </div>
        <article>
          <p>Format Documents</p>
          <main>Decorate with personal style</main>
          <div>Customize your documents with your own style! You can change the color and format every single letter, also upload pictures to anywhere of the whole page. Just edit as you like!</div>
        </article>
      </main>
      <main className="section3-main">
        <article>
          <p>Live Chat</p>
          <main>Chating without border</main>
          <div>Are you tired of switching between Line and Google docs when doing group projects! Collab-In provides you instant messaging function! Now you can discuss and finish your project in the same page! No more annoying swithcing is needed!</div>
        </article>
        <div>
          <img src="/images/onlinechat.png" />
        </div>
      </main>
    </div>;
  }
  componentDidMount(){
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.handleScroll);
  }
}

export default HomepageAbout;