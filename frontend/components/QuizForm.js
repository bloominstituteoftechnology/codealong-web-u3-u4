import React, { useState } from 'react'
import { connect } from 'react-redux'
import * as actions from '../state/action-creators'

export function QuizForm(props) {
  const {
    addOption,
    removeOption,
    questionInputChange,
    questionOptionInputChange,
    questionOptionSetCorrect,
    createQuestion,
    questionForm,
  } = props

  const [optionBars, setOptionBars] = useState(() => {
    let state = {}
    Object.keys(questionForm.options).forEach(key => {
      state[key] = false
    })
    return state
  })

  const onAddOption = evt => {
    evt.preventDefault()
    addOption()
  }
  const onRemoveOption = optionKey => evt => {
    evt.preventDefault()
    removeOption(optionKey)
  }
  const onQuestionChange = ({ target: { name, value } }) => {
    questionInputChange({ name, value })
  }
  const onQuestionOptionChange = optionKey => ({ target }) => {
    const { name, value } = target
    questionOptionInputChange({ optionKey, name, value })
  }
  const onQuestionSetCorrect = optionKey => () => {
    questionOptionSetCorrect(optionKey)
  }
  const onSubmit = evt => {
    evt.preventDefault()
    const payload = { ...questionForm, options: Object.values(questionForm.options) }
    createQuestion(payload)
  }
  const toggleBar = optionId => {
    setOptionBars({ ...optionBars, [optionId]: !optionBars[optionId] })
  }
  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>New Quiz</h2>
      <input
        type="text"
        maxLength={50}
        placeholder="Question title"
        name="question_title"
        value={questionForm.question_title}
        onChange={onQuestionChange}
      />
      <textarea
        placeholder="Question text"
        name="question_text"
        value={questionForm.question_text}
        onChange={onQuestionChange}
      />
      <div className="options-heading"><h2>Options</h2><button onClick={onAddOption}>add option</button></div>
      {
        Object.keys(questionForm.options).map((optionKey, idx) => {
          const option = questionForm.options[optionKey]
          return (
            <div className={`option${option.is_correct ? " truthy" : ""}`} key={optionKey}>
              <div className="option-bar" onClick={() => toggleBar(optionKey)}>
                Option {idx + 1}&nbsp;&nbsp;&nbsp;&nbsp;{!optionBars[optionKey] && (option.option_text.slice(0, 30))}
                <button
                    disabled={Object.keys(questionForm.options).length < 3}
                    onClick={onRemoveOption(optionKey)}>✖️</button>
              </div>
              {
                optionBars[optionKey] &&
                <div className="option-inputs">
                  <textarea
                    maxLength={400}
                    placeholder="Option text"
                    name="option_text"
                    value={option.option_text}
                    onChange={onQuestionOptionChange(optionKey)}
                  />
                  <input
                    type="text"
                    maxLength={400}
                    placeholder="Option remark"
                    name="remark"
                    value={option.remark}
                    onChange={onQuestionOptionChange(optionKey)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      name="is_correct"
                      checked={option.is_correct}
                      onChange={onQuestionSetCorrect(optionKey)}
                    />&nbsp;&nbsp;correct option
                  </label>
                </div>
              }
            </div>
          )
        })
      }
      <button>Submit Quiz</button>
    </form >
  )
}

export default connect(st => st, actions)(QuizForm)
