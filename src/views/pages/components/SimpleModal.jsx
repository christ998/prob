import React, { useState, forwardRef, useImperativeHandle } from "react";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'

const SimpleModal = forwardRef((props, ref) => {
    const [display, setDisplay] = useState(false);
    const [modalOptions, setModalOptions] = useState({});

    useImperativeHandle(ref, () => {
        return {
            setModal: (options) => setModal(options)
        }
    });

    const setModal = (options) => {
        let state = false
        if (options?.title) {
            state = true;
        }
        setModalOptions(options);
        setDisplay(state);
    }

    if (display) {
        return (
            <div>
                <Modal isOpen={display}>
                    <ModalHeader toggle={() => setModal({})}>
                        {modalOptions.title}
                    </ModalHeader>
                    <ModalBody>
                        {modalOptions.text}
                    </ModalBody>
                    <ModalFooter>
                        {modalOptions.type === 1 
                            ? <Button color="secondary" onClick={() => setModal({})}>Cerrar</Button> 
                            : <div><Button color="primary" onClick={() => modalOptions.fx()}>Confirmar</Button>{' '}<Button color="secondary" onClick={() => setModal({})}>Cancelar</Button></div>
                        }
                    </ModalFooter>
                </Modal> 
            </div>
        );
    };
    return null;
});

export default SimpleModal;