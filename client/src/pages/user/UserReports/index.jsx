import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { message, Table } from 'antd';
import { getAllReportsByUser } from '../../../apicalls/reports';
import { showLoading, hideLoading } from '../../../redux/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';


const UserReports = () => {
    const [reportsData, setReportsData] = useState([]);
    const dispatch = useDispatch();
    const columns = [
        {
            title: 'Exam Name',
            dataIndex: 'examName',
            render: (text, record) =><>
            {record.exam.name}
            </>
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: (text, record) =><>
            {moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss')}
            </>
        },
        {
            title: 'Total Marks',
            dataIndex: 'totalQuestions',
            render: (text, record) =><>
            {record.exam.totalMarks}
            </>
        },
        {
            title: 'Passing Marks',
            dataIndex: 'correctAnswers',
            render: (text, record) =><>
            {record.exam.passingMarks}
            </>
        },
       
        {
            title: 'Obtained Marks',
            dataIndex: 'correctAnswers',
            render: (text, record) =><>
            {record.result.correctAnswers.length}
            </>
        },
        {
            title: 'Verdict',
            dataIndex: 'verdict',
            render: (text, record) =><>
            {record.result.verdict}
            </>
        }
    ];



    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await getAllReportsByUser();
            if (response.success) {
                setReportsData(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            message.error(error.message)
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div>
            <PageTitle title={'Reports'}></PageTitle>
            <div className='divider'></div>
            <Table columns={columns} dataSource={reportsData}></Table>
        </div>
    )
}

export default UserReports;