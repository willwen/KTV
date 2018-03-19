import $ from "jquery"

export default class ScrollUp extends React.Component {

  constructor() {
    super();
    this.animateScrollUp = this.animateScrollUp.bind(this);
  }
  
  animateScrollUp(){
    $("html, body").animate({scrollTop: 0}, 1000);
    return false;
  }

  render() {
    return (
      <div className="scrollup">
        <a href="#" onClick={this.animateScrollUp}>
          <i className = "fa fa-chevron-up">
          </i>
        </a>
      </div>
    );
  }
}
