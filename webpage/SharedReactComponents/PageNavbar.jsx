import React from "react";
import {
  Collapse,
  Dropdown,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import $ from "jquery"

export default class PageNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true,
      navbarClass: ""
    };
  }
  componentDidMount(){
    document.addEventListener("scroll", ()=>{
      let top = $(document).scrollTop();

      let height = 300;
          //alert(batas);

      if (top > height) {
          this.setState({
            navbarClass : 'menu-scroll'
          });
      } else {
          this.setState({
            navbarClass : ''
          });
      }    
    })
    
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  render() {
    return (
        <Navbar fixed="top" dark expand="md" className={this.state.navbarClass}>
          <NavbarBrand href="/">
            <img src="logo.png" alt="logo" width="50" />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={!this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/about">About</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/treefind">Search</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/contribution/submit">Submit a Song</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/timepicker">TimePicker</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
       
    );
  }
}
