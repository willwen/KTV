import React from "react";

export default class PageHeader extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className = "half-height">
       <div className = "header_img">
            <div className = "header_text">
              <span className = "border">
                <div className="welcome">
                  <h1>Become a Karaoke Legend</h1>
                  <h2>
                    A Website to Learn Foreign Songs<br />by Will Wen
                  </h2>
                  <a
                    href="https://github.com/willwen/KTV"
                    target="_blank"
                    className="fa fa-github"
                  />
                  <a
                    href="https://www.linkedin.com/in/will-wen-52480559/"
                    target="_blank"
                    className="fa fa-linkedin"
                  />
                </div>
              </span>
            </div>
        </div>
      </div>
        
    );
  }
}
