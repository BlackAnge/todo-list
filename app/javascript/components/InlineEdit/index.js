import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

const escKey = 27
const enterKey = 13

export default class InlineEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      prevText: props.text,
      text: props.text
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.inputDisabled === this.props.inputDisabled) return
    this.setState({ isEditing: false })
  }

  _handleFocus = () => {
    if (this.props.inputDisabled === 'completed') return

    const { text, prevText, isEditing } = this.state

    if (isEditing && text !== prevText) {
      if (typeof this.props.onFocusOut === 'function') this.props.onFocusOut(this.props.labelId, text)
    }

    this.setState({
      isEditing: !isEditing,
      prevText: text
    })
  }

  _handleChange = () => {
    this.setState({ text: this.textInput.value }, () => {
      this.props.onCurrentText(this.textInput.value)
    })
  }

  _handleEvent = (e) => {
    if (e.charCode === enterKey) {
      this.setState({ isEditing: true })
      this._handleFocus()
    } else {
      document.addEventListener('keydown', this._escFunction)
    }
  }

  _escFunction = (e) => {
    if (e.keyCode === escKey) {
      this.setState({
        text: this.state.prevText,
        isEditing: true
      })
      this._handleFocus()
    }
  }

  _editInput = () => {
    return (
      <input
        type='text'
        className={this.props.inputClassName}
        ref={(input) => (this.textInput = input)}
        value={this.state.text}
        onChange={this._handleChange}
        onKeyPress={this._handleEvent}
        onBlur={this._handleFocus}
        tabIndex={this.props.inputTabIndex}
        autoFocus
      />
    )
  }

  render() {
    const label = (
      <div>
        <label
          data-tip={this.props.labelTooltip || ''}
          className={this.props.labelClassName}
          onClick={this._handleFocus}
        >
          {this.state.text}
        </label>
        <ReactTooltip />
      </div>
    )

    return this.state.isEditing && this._editInput() || label
  }
}

InlineEdit.propTypes = {
  text: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  labelId: PropTypes.number,
  labelTooltip: PropTypes.string,
  inputTabIndex: PropTypes.number,
  inputClassName: PropTypes.string,
  inputDisabled: PropTypes.string,
  inputBorderWidth: PropTypes.string,
  onFocusOut: PropTypes.func,
  onCurrentText: PropTypes.func
}
