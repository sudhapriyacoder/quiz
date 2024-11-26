import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Row, Col, Select, message, Tabs, Table } from 'antd';
import { addExam, deleteQuestionById, editExamById, getExamById } from '../../../apicalls/exams';
import {showLoading, hideLoading} from '../../../redux/loaderSlice';
import { useDispatch } from 'react-redux';
import AddEditQuestion from './AddEditQuestion';
const {TabPane} = Tabs;

const AddEditExam = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [examData, setExamData] = useState(null);
    const params = useParams();
    const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const onFinish = async (values) => {
        try {
            let response;
            dispatch(showLoading());
            if(params.id) {
             response = await editExamById({...values, examId: params.id});
            } else {
               response = await addExam(values);
            }
            response = await addExam(values);
            dispatch(hideLoading());
            if (response.success) {
                message.success(response.success);
                navigate('/admin/exams');
            } else {
                message.error(response)
            }
            dispatch(hideLoading());
        } catch (error) {
            message.error(error.message)
            dispatch(hideLoading());
        }
    }
    const getExamData = async () => {
      try {
        dispatch(showLoading());
        const response = await getExamById({examId: params.id});
        dispatch(hideLoading());
        if(response.success) {
            setExamData(response.data);
        } else {
            message.error(response.message);
        }
      } catch(error) {
         dispatch(hideLoading());
         message.error(error.message);
      }
    }
    useEffect(()=> {
      if(params.id) {
        getExamData();
      }

    }, []);

    const editQuestion = (record) => {
        setSelectedQuestion(record);
        setShowAddEditQuestionModal(true)
    }

    const deleteQuestion = async (questionId) => {
        try {
            dispatch(showLoading());
            const response = await deleteQuestionById({
                questionId,
                examId: params.id
            });
            dispatch(hideLoading());
            if(response.success) {
                message.success(response.message);
                getExamData();
            } else {
                message.error(response.message);
            }
        } catch(error) {
            dispatch(hideLoading());
            message.error(error.message);
        }
    }

    const questionsColumns = [
        {
            title: 'Question',
            dataIndex: 'name'
        },
        {
           title: 'Options',
           dataIndex: 'options',
           render: (text, record) => {
            return Object.keys(record.options).map((key) => {
                return <div> {key}: {record.options[key]}

                </div>
            })
           }
        },
        {
            title: 'Correct option',
            dataIndex: 'correctOption',
            render : (text, record) => {
                console.log('========================', text, record)
                return `${record.correctOption}: ${record.options[record.correctOption]}`
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render : (text, record) => (
                <div className='flex gap-2'>
                <i className='ri-pencil-line' onClick={() => {
                    editQuestion(record)
                }}></i>
                <i className='ri-delete-bin-line' onClick={() => {deleteQuestion(record._id)}}></i>
               </div>
            )
        }
    ]

    return <div>
        <PageTitle title={params.id ? 'Edit Exam' : 'Add Exam'}></PageTitle>
        <div className='divider'></div>
        {(examData || !params.id) && <Form layout='vertical' onFinish={onFinish} initialValues={examData}> 
            <Tabs defaultActiveKey="1">
                <TabPane tab="Exam Details" key="1">
                <Row gutter={[10, 10]}>
                <Col span={8}>
                    <Form.Item label='Exam Name' name='name'>
                        <input type='text' />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Exam Duration' name='duration'>
                        <input type='number' />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Category' name='category'>
                        <select name='' id=''>
                            <option value=''>Select Category</option>
                            <option value="javascript">Javacsript</option>
                            <option value="react">React</option>
                            <option value="node">Node</option>
                            <option value="mongo">Mongo</option>
                        </select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Total Marks' name='totalMarks'>
                        <input type='number' />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='Passing Marks' name='passingMarks'>
                        <input type='number' />
                    </Form.Item>
                </Col>
            </Row>
            <div className='flex justify-end gap-2'>
            <button className='secondary-outlined-btn' type='button' onClick={() => navigate('/admin/exams')}>Cancel</button>

                <button className='primary-contained-btn' type='submit'>Save</button>
            </div>
                </TabPane>
                {params.id && (<TabPane tab="Questions" key="2">
                    <div className='flex justify-end'>
                         
                         <button className='primary-outlined-btn' type='button' onClick={() => setShowAddEditQuestionModal(true)}>Add Question</button>
                    </div>
                    <Table columns={questionsColumns} dataSource={examData?.questions || []} />
                </TabPane>)}
            </Tabs>
           
            
        </Form>}
        {showAddEditQuestionModal && <AddEditQuestion
        setShowAddEditQuestionModal={setShowAddEditQuestionModal} 
        showAddEditQuestionModal = {showAddEditQuestionModal}
        examId = {params.id}
        refreshData = {getExamData}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        />}
    </div>
}

export default AddEditExam;