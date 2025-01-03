import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { message, Table } from 'antd';
import { getAllReports } from '../../../apicalls/reports';
import { showLoading, hideLoading } from '../../../redux/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';


const AdminReports = () => {
    const [reportsData, setReportsData] = useState([]);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        examName: '',
        userName: ''
    });
    const columns = [
        {
            title: 'Exam Name',
            dataIndex: 'examName',
            render: (text, record) =><>
            {record.exam.name}
            </>
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            render: (text, record) =><>
            {record.user.name}
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



    const getData = async (tempFilters) => {
        try {
            dispatch(showLoading());
            const response = await getAllReports(tempFilters);
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
        getData(filters);
    }, [])

    return (
        <div>
            <PageTitle title={'Reports'}></PageTitle>
            <div className='divider'></div>
            <div className='flex gap-2 w-25'>
                <input type='text' placeholder='Exam' value={filters.examName} onChange={(e) => setFilters({...filters, examName: e.target.value})}/>
                <input type='text' placeholder='User' value={filters.userName} onChange={(e) => setFilters({...filters, userName: e.target.value})} />
                <button className='primary-contained-btn' onClick={() => {
                    setFilters({
                        examName: '',
                        userName: ''
                    }); getData({examName: '', userName: ''});
                }}>Clear</button>
                <button className='primary-contained-btn' onClick={() => getData(filters)}>Search</button>
            </div>
            <Table columns={columns} dataSource={reportsData} className='mt-2'></Table>
        </div>
    )
}

export default AdminReports;