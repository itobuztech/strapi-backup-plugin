// @ts-nocheck
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
} from "@strapi/design-system";

import { dataBackupRequests } from '../../api/dataBackup';

const TodoModal = ({ setShowModal, fileName, restoring, fetchFileList, handleError}) => {
  const restoreBackup = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const formData = new FormData();
      formData.append('file', fileName);
      formData.append('fileName', fileName.name);
      restoring(true);
      setShowModal(false);
      const restoredFile = await dataBackupRequests.restoreFile(fileName.name);
      
      if (restoredFile.error) {
        restoring(false);
        await fetchFileList();
        console.log(`${restoredFile.status}: ${restoredFile.errMsg}`);       
        handleError(`${restoredFile.status}: ${restoredFile.errMsg}`);
      }else{
        restoring(false);
        await fetchFileList();
      }
    } catch (e) {    
      restoring(false);
      handleError(`${restoredFile.status}: ${restoredFile.errMsg}`);
    }
  };  

  return (
    <ModalLayout style={{width: 580}}
      onClose={() => setShowModal(false)}
      labelledBy="title"
      as="form"
      onSubmit={(e)=>{restoreBackup(e)}}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Confirmation
        </Typography>
      </ModalHeader>
 
      <ModalBody>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">The import will delete your existing data! Are you sure you want to proceed?</Typography>
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button type="submit">Restore</Button>}
      />
    </ModalLayout>
  );
}

export default TodoModal;
