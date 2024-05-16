import React, { useState } from 'react';
import './App.css';
import Navbar from './navbar';
import ThankYou from './ThankYou'; 

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    designation: '', 
    sections: [
      { id: 1, title: "Section 1", questions: [{ text: "Percentage improvement in addition of new customers/sq. Ft and 100 % retention of old customer base", checked: false, marks: 3 }, { text: "FCR resulted as per Standard i.e. 1.55 for 2kg all season", checked: false, marks: 5 }, { text: "Monitoring and controlling below costing\na) Branch cost\nb) Total CBF Cost", checked: false, marks: 4 }, { text: "a)Getting reports from all BM\nb) Forwarding reports to higher authority", checked: false, marks: 3 }, { text: "Followed all minimum CBF norms prior to placement i.e.\ni) Gap Days\nii) Per bird sq. Ft\niii) improvement in Brooding ", checked: false, marks: 5 }, { text: "No placement to blocked farmer, Hessel free summer management for placement ", checked: false, marks: 5 }] },
      { id: 2, title: "Section 2", questions: [{ text: "Develop and review Systems : Ensure  100% Compliance through regular review &  internal audits", checked: false, marks: 3 }, { text: "Carry out 3 monthly internal audits & report with all non conformances/ feedback showing continuous improvement", checked: false, marks: 3 }, { text: "Reporting data of all systems in a systematic and error free manner - 100% Accuracy", checked: false, marks: 3 }, { text: "To manage, along with the Management team on CBF, the achievement of Key Performance indicators of team members  and identify improvement/requirements  to meet targets and develop plans to achieve them", checked: false, marks: 3 }, { text: "Regular visits to farms & ensure adherence to customer requirement & asses farm management on deviations to ensure 100% compliance Score %", checked: false, marks: 3 }, { text: "Improving Customer satisfaction score by 10% every year", checked: false, marks: 2 }, { text: "Accident rate should be zero with educating team", checked: false, marks: 3 }] },
      { id: 3, title: "Section 3", questions: [{ text: "Addition of new branches", checked: false, marks: 5 }, { text: "Increasing placement capacity  in current branches", checked: false, marks: 5 }, { text: "Improve farmer relaetionships to growing business", checked: false, marks: 5 }] },
      { id: 4, title: "Section 4", questions: [{ text: "100% implementation throughout organisation as well as in industry", checked: false, marks: 10 }, { text: "Developing good PR in the organization and suppliers for extending future business", checked: false, marks: 10 }] },
      { id: 5, title: "Section E", questions: [{ text: "a)Self development \nb) team deveolpment\nc) Software team development ", checked: false, marks: 10 }, { text: "Identify and creating second pipe line of Critical positions - 100% adherence ", checked: false, marks: 10 }] },
    ]
  });
  const [submitted, setSubmitted] = useState(false);

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
    setFormData({ ...formData, sections: newSections });
  };

  const calculateSectionTotalMarks = (sectionIndex) => {
    const section = formData.sections[sectionIndex];
    return section.questions.reduce((total, question) => total + (question.checked ? question.marks : 0), 0);
  };

  const calculateTotalScore = () => {
    return formData.sections.reduce((total, section) => total + calculateSectionTotalMarks(formData.sections.indexOf(section)), 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await writeData();
    console.log("Form submitted:", formData);
    setSubmitted(true); 
  };

  const writeData = async () => {
    const sectionMarks = formData.sections.map((section, index) => calculateSectionTotalMarks(index));
    const totalMarks = sectionMarks.reduce((total, mark) => total + mark, 0);
    const dataToWrite = {
      data: [
        formData.fullName,
        formData.designation,
        formData.phoneNumber,
        ...sectionMarks,
        totalMarks
      ]
    };

    try {
      const response = await fetch("https://omkar.bhaskaraa45.me/write", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToWrite)
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log("Failed to write data:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      {submitted ? (
        <ThankYou />
      ) : (
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
          <div>
            <label>
              Designation:
              <select name="designation" value={formData.designation} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
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
      )}
      <div className="total-score">
        <h3>Total Score: {calculateTotalScore()}</h3>
      </div>
    </div>
  );
}

export default App;
