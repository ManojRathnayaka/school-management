import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slider, Button, Input, message, Select, Row, Col, Tabs } from 'antd';
import Layout from "../components/Layout";

const { TabPane } = Tabs;

export default function ClassPerformance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [performance, setPerformance] = useState({
    academic_score: 0,
    sports_score: 0,
    discipline_score: 0,
    leadership_score: 0,
    comments: '',
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const teacherId = 1; // Replace this with dynamic data from authentication

  useEffect(() => {
    // Fetch classes assigned to the teacher
    axios
      .get(`/api/classes/teacher/${teacherId}`)
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error(error);
        message.error('Error fetching classes.');
      });
  }, [teacherId]);

  const handleClassChange = (classId) => {
    setSelectedClass(classId);

    // Fetch students for the selected class
    axios
      .get(`/api/classes/${classId}/students`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
        message.error('Error fetching students.');
      });
  };

  const handleStudentChange = (studentId) => {
    setSelectedStudent(studentId);

    // Fetch performance for the selected student
    axios
      .get(`/api/student-performance/${studentId}`)
      .then((response) => {
        setPerformance(response.data);
        // Fetch the audit logs for the selected student
        axios
          .get(`/api/student-performance/${studentId}/audit`)
          .then((response) => {
            setAuditLogs(response.data);
          })
          .catch((error) => {
            console.error(error);
            message.error('Error fetching audit logs.');
          });
      })
      .catch((error) => {
        console.error(error);
        message.error('Error fetching student performance.');
      });
  };

  const handleSave = () => {
    setLoading(true);
    axios
      .put(`/api/class-performance/${selectedStudent}`, performance)
      .then(() => {
        message.success('Performance updated successfully!');
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        message.error('Error updating performance.');
        setLoading(false);
      });
  };

  const handleSliderChange = (field, value) => {
    setPerformance({ ...performance, [field]: value });
  };

  const calculateOverallScore = () => {
    const total =
      performance.academic_score +
      performance.sports_score +
      performance.discipline_score +
      performance.leadership_score;
    return total / 4;
  };

  return (
    <Layout activePage="class-performance">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Class Performance</h2>

        <Row gutter={16}>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Class"
              onChange={handleClassChange}
              value={selectedClass}
            >
              {classes.map((classItem) => (
                <Select.Option key={classItem.class_id} value={classItem.class_id}>
                  {classItem.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Student"
              onChange={handleStudentChange}
              value={selectedStudent}
              disabled={!selectedClass}
            >
              {students.map((student) => (
                <Select.Option key={student.student_id} value={student.student_id}>
                  {student.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        {selectedStudent && (
          <div style={{ marginTop: '20px' }}>
            <h3>Performance for {selectedStudent.name}</h3>

            {/* Performance Sliders */}
            <div>
              <div>
                <strong>Academic Score:</strong>
                <Slider
                  value={performance.academic_score}
                  onChange={(value) => handleSliderChange('academic_score', value)}
                  max={100}
                />
              </div>

              <div>
                <strong>Sports Score:</strong>
                <Slider
                  value={performance.sports_score}
                  onChange={(value) => handleSliderChange('sports_score', value)}
                  max={100}
                />
              </div>

              <div>
                <strong>Discipline Score:</strong>
                <Slider
                  value={performance.discipline_score}
                  onChange={(value) => handleSliderChange('discipline_score', value)}
                  max={100}
                />
              </div>

              <div>
                <strong>Leadership Score:</strong>
                <Slider
                  value={performance.leadership_score}
                  onChange={(value) => handleSliderChange('leadership_score', value)}
                  max={100}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <Input.TextArea
                  value={performance.comments}
                  onChange={(e) => setPerformance({ ...performance, comments: e.target.value })}
                  placeholder="Add comments"
                  rows={4}
                />
              </div>

              <h4>Overall Score: {calculateOverallScore()}</h4>
              <Button type="primary" onClick={handleSave} loading={loading}>
                Save Changes
              </Button>
            </div>

            {/* Audit Logs */}
            <h4 style={{ marginTop: '30px' }}>Audit History</h4>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Audit History" key="1">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <div key={log.audit_log_id}>
                      <p>
                        {log.field_changed} changed from {log.old_value} to {log.new_value} by{' '}
                        {log.changed_by}
                      </p>
                      <p>
                        <small>{new Date(log.changed_at).toLocaleString()}</small>
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No audit history available.</p>
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
}
