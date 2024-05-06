import React, { useState } from 'react';
import './App.css';
import Navbar from './navbar';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    sections: [
      { id: 1, title: "Section 1 (60 Marks)", marks: 60, questions: [{ text: "Question 1", checked: false }, { text: "Question 2", checked: false }, { text: "Question 3", checked: false }, { text: "Question 4", checked: false }] },
      { id: 2, title: "Section 2 (15 Marks)", marks: 15, questions: [{ text: "Question 1", checked: false }, { text: "Question 2", checked: false }, { text: "Question 3", checked: false }, { text: "Question 4", checked: false }] },
      { id: 3, title: "Section 3 (15 Marks)", marks: 15, questions: [{ text: "Question 1", checked: false }, { text: "Question 2", checked: false }, { text: "Question 3", checked: false }, { text: "Question 4", checked: false }] },
      { id: 4, title: "Section 4 (10 Marks)", marks: 10, questions: [{ text: "Question 1", checked: false }, { text: "Question 2", checked: false }, { text: "Question 3", checked: false }, { text: "Question 4", checked: false }] },
    ]
  });
  const [marks, setMarks] = useState([]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleCheckboxChange = (sectionIndex, questionIndex) => {
    const newSections = formData.sections.map((section, idx) => {
      if (idx === sectionIndex) {
        const newQuestions = section.questions.map((q, qIdx) => {
          if (qIdx === questionIndex) {
            return { ...q, checked: !q.checked };
          }
          return q;
        });
        return { ...section, questions: newQuestions };
      }
      return section;
    });
    const updatedFormData = { ...formData, sections: newSections };
    setFormData(updatedFormData);

    const newMarks = updatedFormData.sections.map(section =>
      section.questions.filter(q => q.checked).length * (section.marks / section.questions.length)
    );
    setMarks(newMarks);
  };

  const calculateTotalScore = () => {
    return formData.sections.reduce((total, section) =>
      total + section.questions.filter(q => q.checked).length * (section.marks / section.questions.length), 0);
  };

  const calculateSectionTotalMarks = (sectionIndex) => {
    const section = formData.sections[sectionIndex];
    return section.questions.filter(q => q.checked).length * (section.marks / section.questions.length);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data, e.g., submit it to a server

    const values = [formData.fullName, formData.phoneNumber, ...marks]
    writeData(values)
    console.log("Form submitted:", values);
  };

  const writeData = async (values) => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/write", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: values })
      })

      const result = await resp.json()
      console.log(result)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </label>
        </div>
        {formData.sections.map((section, sIndex) => (
          <section key={section.id}>
            <h4>{section.title}</h4>
            {section.questions.map((question, qIndex) => (
              <label key={qIndex}>
                <input
                  type="checkbox"
                  checked={question.checked}
                  onChange={() => handleCheckboxChange(sIndex, qIndex)}
                />
                {question.text}
              </label>
            ))}
            <div>This Section Marks: {calculateSectionTotalMarks(sIndex)}</div>
          </section>
        ))}
        <button type="submit" className="submit-button">Submit</button>
      </form>
      <div className="total-score">
        <h3>Total Score: {calculateTotalScore()}</h3>
      </div>
    </div>
  );
}

export default App;
