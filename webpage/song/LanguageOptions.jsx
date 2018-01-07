export default class LanguageOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pronounciationChecked: true,
      primaryChecked: true,
      translatedChecked: true
    };
  }

  modifyOptions(e) {
    e.preventDefault();
  }

  changePronounciation() {
    this.setState(
      {
        pronounciationChecked: !this.state.pronounciationChecked
      },
      () => {
        this.props.togglePronounciation(this.state.pronounciationChecked);
      }
    );
  }

  changePrimary() {
    this.setState(
      {
        primaryChecked: !this.state.primaryChecked
      },
      () => {
        this.props.togglePrimary(this.state.primaryChecked);
      }
    );
  }

  changeTranslated() {
    this.setState(
      {
        translatedChecked: !this.state.translatedChecked
      },
      () => {
        this.props.toggleTranslated(this.state.translatedChecked);
      }
    );
  }

  render() {
    return (
      <div className="displayLanguages col">
        <form onSubmit={this.modifyOptions}>
          <span>Display Languages:</span>
          <div className="checkbox">
            <span>
              <label>
                <input
                  id="pronounciationCB"
                  type="checkbox"
                  checked={this.state.pronounciationChecked}
                  onChange={this.changePronounciation.bind(this)}
                  disabled={this.props.pronounciationLanguage ? false : true}
                />
                {this.props.pronounciationLanguage}
              </label>
            </span>
          </div>
          <div className="checkbox">
            <span>
              <label>
                <input
                  id="primaryCB"
                  type="checkbox"
                  checked={this.state.primaryChecked}
                  onChange={this.changePrimary.bind(this)}
                  disabled={this.props.primaryLanguage ? false : true}
                />
                {this.props.primaryLanguage}
              </label>
            </span>
          </div>
          <div className="checkbox">
            <span>
              <label>
                <input
                  id="TranslatedCB"
                  type="checkbox"
                  checked={this.state.translatedChecked}
                  onChange={this.changeTranslated.bind(this)}
                  disabled={this.props.translatedLanguage ? false : true}
                />
                {this.props.translatedLanguage}
              </label>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
