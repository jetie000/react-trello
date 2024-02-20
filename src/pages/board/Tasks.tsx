import { IColumn } from '@/types/column.interface';
import { ITask } from '@/types/task.interface';
import moment from 'moment';
import * as React from 'react';

interface TasksProps {
    column: IColumn,
    setCurrentColumn: Function,
    setCurrentTask: Function
    setDrugStartTask: Function
}

function Tasks({
    column,
    setCurrentColumn,
    setCurrentTask,
    setDrugStartTask
}: TasksProps) {

    const tasksSorted = React.useMemo(
        () => column.tasks && column.tasks.slice()
            .sort((t1, t2) => new Date(t2.moveDate).getMilliseconds() - new Date(t1.moveDate).getMilliseconds())
        , [column.tasks])

    function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
        e.stopPropagation()
    }
    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
    }
    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, t: ITask) {
        e.stopPropagation()
        setDrugStartTask(t)
    }

    return (
        <div className='rounded-2 d-flex flex-column'>
            {
                tasksSorted && tasksSorted.map(t =>
                    <div className='d-flex flex-column board-task cursor-pointer cursor-grab' key={t.id} draggable={true}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragStart={(e) => dragStartHandler(e, t)}
                        onDragOver={(e) => dragOverHandler(e)}
                        onClick={() => setCurrentTask(t)} data-bs-toggle="modal" data-bs-target="#changeTask">
                        <span className='fs-5'>{t.name}</span>
                        <span>Moved:</span>
                        <span className='text-truncate'>{moment(t.moveDate).fromNow()}</span>
                        <span>Created:</span>
                        <span className='text-truncate'>{moment(t.creationDate).fromNow()}</span>
                        <div className='d-flex'>
                            <span>Users:</span>
                            <div className='ms-auto d-flex gap-1' >
                                {
                                    t.users.filter((t, i) => i < 3).map(tu =>
                                        <div key={tu.id}
                                            className='d-flex board-users-avatar-sm bg-secondary text-light
                                         border rounded-circle align-items-center justify-content-center'>
                                            {tu.fullName[0]}
                                        </div>)
                                }
                                {
                                    t.users.length > 3 && '...'
                                }
                                {t.users.length === 0 && 'add users'}
                            </div>
                        </div>
                    </div>
                )
            }
            {
                tasksSorted && tasksSorted?.length > 0 && <hr className='mb-2 mt-2' />
            }
            <button onClick={() => setCurrentColumn(column)} className='btn btn-primary border rounded-2' data-bs-toggle="modal" data-bs-target="#addTask">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
            </button>
        </div>
    );
}

export default Tasks;