import React from 'react';
import './Modal.scss';

function Modal(props) {
    
    return (
        <div className="custom-modal">
            <div className="card text-dark">
                <div className="card-header d-flex justify-content-center">
                    <h3 className="m-2">{props.title}</h3>
                </div>
                <div className="card-body">
                    <p className="m-2">{props.message}</p>
                </div>
                <div className="card-footer">
                    <div className="d-grid gap-2 d-flex justify-content-md-center">
                        <button type="button" 
                            onClick={() => props.actionHandler('cancel')}
                            className="btn btn-secondary">{props.cancelActionLabel}</button>
                        <button type="button" 
                            onClick={() => props.actionHandler('confirm')}
                            className="btn btn-warning">{props.confirmActionLabel}</button>
                    </div>
                </div>
            </div> 
        </div>
    )
}

export default Modal;