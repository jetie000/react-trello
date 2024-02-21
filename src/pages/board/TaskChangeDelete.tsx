import { useActions } from '@/hooks/useActions';
import { useChangeTaskMutation, useDeleteTaskMutation } from '@/store/api/task.api';
import { ITask } from '@/types/task.interface';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Toast as bootstrapToast } from 'bootstrap';
import { Modal as bootstrapModal } from 'bootstrap';
import UsersList from '@/components/usersList/UsersList';
import Modal from '@/components/modal/Modal';
import { useParams } from 'react-router-dom';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { variables } from '@/variables';


function TaskChangeDelete({ task }: { task: ITask | undefined }) {
    const { id } = useParams()
    const { language } = useSelector((state: RootState) => state.options);
    const { setToastChildren } = useActions();
    const changeTaskNameRef = useRef<HTMLInputElement>(null)
    const changeTaskDescRef = useRef<HTMLTextAreaElement>(null)
    const [changeTask, { isSuccess: isSuccessChange, isError: isErrorChange, isLoading: isLoadingChange }] = useChangeTaskMutation()
    const [deleteTask, { isSuccess: isSuccessDelete, isError: isErrorDelete, isLoading: isLoadingDelete }] = useDeleteTaskMutation()
    const [userIds, setUserIds] = useState<number[]>([])

    React.useEffect(() => {
        if (task?.users.length) {
            setUserIds(task.users.map(u => u.id))
        }
    }, [task?.users])

    const changeTaskClick = () => {
        if (changeTaskNameRef.current && changeTaskDescRef.current &&
            changeTaskNameRef.current.value !== '' && task) {
            changeTask({
                id: task.id,
                name: changeTaskNameRef.current.value,
                description: changeTaskDescRef.current.value,
                userIds,
                columnId: task.columnId
            })
        }
    }

    const deleteTaskClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('deleteTask') || 'deleteTask');
        myModal.show();
    }

    React.useEffect(() => {
        if (isSuccessChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].TASK_CHANGED)
            myToast.show()
        }
        if (isErrorChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_REQUEST)
            myToast.show()
        }
    }, [isLoadingChange])

    React.useEffect(() => {
        if (isSuccessDelete) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('deleteTask') || 'deleteTask');
            myModal.hide();
            const myModal2 = bootstrapModal.getOrCreateInstance(document.getElementById('changeTask') || 'changeTask');
            myModal2.hide();
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].TASK_DELETED)
            myToast.show()
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_REQUEST)
            myToast.show()
        }
    }, [isLoadingDelete])

    return (
        <div className="d-flex flex-column">
            <label htmlFor="inputTaskNameChange">{variables.LANGUAGES[language].NAME}</label>
            <input className="form-control mb-2" id="inputTaskNameChange"
                placeholder={variables.LANGUAGES[language].ENTER_NAME} ref={changeTaskNameRef} defaultValue={task?.name} />
            <label htmlFor="inputTaskDescChange">{variables.LANGUAGES[language].DESCRIPTION}</label>
            <textarea className="form-control mb-2" id="inputTaskDescChange"
                placeholder={variables.LANGUAGES[language].ENTER_DESCRIPTION} ref={changeTaskDescRef} defaultValue={task?.description} />
            <UsersList userIds={userIds} setUserIds={setUserIds} boardId={Number(id)}/>
            <button className='btn btn-primary mt-2 mb-2' onClick={changeTaskClick}>
                {variables.LANGUAGES[language].CHANGE_TASK}
            </button>
            <button className='btn btn-danger' onClick={() => deleteTaskClick()}>
                {variables.LANGUAGES[language].DELETE_TASK}
            </button>
            <Modal id='deleteTask' title={variables.LANGUAGES[language].DELETE_TASK} size='sm'>
                <div className='d-flex flex-column gap-2'>
                    <div>
                        {variables.LANGUAGES[language].SURE_DELETE_TASK}
                    </div>
                    <button className='btn btn-danger' onClick={() => deleteTask({ taskId: task?.id || 0, boardId: Number(id) || 0 })}>
                        {variables.LANGUAGES[language].DELETE_TASK}
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default TaskChangeDelete;