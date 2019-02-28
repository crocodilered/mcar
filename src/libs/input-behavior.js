/**
 * Class to work with wild-wild BootstrapVue form validation.
 */

class InputBehavior {
  constructor (testFunc) {
    /**
     * Message displayed in form in case if validation failed.
     */
    this.invalidFeedback = ''

    /**
     * Function to test value.
     * Param is VALUE, must return message string if validation error or emplty string otherwise.
     */
    this.testFunc = testFunc
  }

  test (inputValue) {
    if (this && this.testFunc) {
      this.invalidFeedback = this.testFunc(inputValue)
    }
  }

  /**
   * State if input validation in BootstrapVue. Can be UNDEFINED or FALSE.
   */
  get state () {
    return (this.invalidFeedback === '') ? undefined : false
  }

  /**
   * State if input validation in boolean terms. Can be TRUE or FALSE.
   */
  get bool () {
    return (this.state === undefined)
  }
}

export default InputBehavior
