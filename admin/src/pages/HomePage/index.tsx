// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import { BaseHeaderLayout, ContentLayout, Layout, Button, EmptyStateLayout, Box, TextInput, Flex, Alert } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import {BlankPageBgIcon} from '../../components/BlankPageBgIcon';
import { dataBackupRequests } from '../../api/dataBackup';
import { FileTable } from '../../components/FileTable';
import { TotalFileCount } from '../../components/TotalFileCount';
import TodoModal from '../../components/TodoModal';

const HomePage = ({loading}) => {
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState();
  const [fileList, setFileList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let [errorMsg, setErrorMsg] = useState('');

  const createBackup = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();
    event.stopPropagation();
    try {
      setName(name);      
      await loading(true, 'Creating');
      const newFile = await dataBackupRequests.create(name);
      if (newFile.status===505 || newFile.status===404) {
        setErrorMsg(`${newFile.status}: ${newFile.errorMsg}`);
      }
      
      await loading(false, 'Creating');
      
      return await fetchFileList();
    } catch (error) {
      loading(false, 'Creating');
      setErrorMsg(`: ${error}`);
    }
  }

  let fetchFileList = async () => {
    try {
      const files = await dataBackupRequests.listFilesWithDetails();    
      if (!files.length) {
        setFileList(files);
      }
      setFileList(files);
    } catch (error) {
      setErrorMsg(`err:-- ${error}`);
    }
  }

  // Alternative way:- In this case, there isn't need to call frontend api defination in the '/src/admin/api/dataBackup.ts' file. Call the API provided from the backend side.

  /*let fetchFileList = async () => {
    try {
      const files = [];
      fetch(`/strapi-backup-plugin/listFilesWithDetails`)
      .then(response => {
        return response.json();
      }).then((files)=>{
        console.log("files :---", files);
        setFileList(files);
      })
      .catch(error => {
        setErrorMsg(`: ${error}`);
      });
    } catch (error) {
      setErrorMsg(`: ${error}`);
    }
  }*/

  let deleteFile = async (name:string) => {
    try {
      const existingFile = await dataBackupRequests.deleteFile(name);
      if (existingFile.status===505 || existingFile.status===404) {
        setErrorMsg(`${existingFile.status}: ${existingFile.errorMsg}`);
      }

      return await fetchFileList();
    } catch (error) {
      setErrorMsg(`: ${error}`);
    }
  }

  let downloadLink = async (fileName:string) =>{
   try {
    await loading(true, 'Downloading');
    const bufferObject = await dataBackupRequests.downloadFile(fileName);
    const uint8Array = new Uint8Array(bufferObject.data);
    const blob = new Blob([uint8Array]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "downloaded-file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await loading(false, 'Downloading');
   } catch (error) {
    await loading(false, 'Downloading');
    setErrorMsg(`: ${error}`);
   }
  }

  useEffect(() => {    
    fetchFileList().then(files=>{
      return files;
    });
  }, []);

  const restoring = (boolValue:boolean) => {
    loading(boolValue, 'Restoring');
  }

  const handleError = (e) =>{
    setErrorMsg(`: ${e}`);
  }
  
  return (
    <>
        <Layout>
          <BaseHeaderLayout
            title="Strapi-Backup Plugin"
            subtitle = "Create and restore backup files"
            as = "h2"
          />
        </Layout>
        
        <ContentLayout>
          {errorMsg && (
          <>
            <Box style={{width: 700}}>
              <Flex direction="column" alignItems="center" spacing={1}>
                <Alert closeLabel="Close" title="Error " variant="danger">
                  {errorMsg}
                </Alert>
              </Flex>
            </Box>
          </>)
          }

          <Box padding={2} as="form" onSubmit={createBackup}>
            <Flex>
              <Box>
                <TextInput fullWidth
                  placeholder="Enter backup name..."
                  label="Name"
                  name="text"
                  hint="Max 40 characters"
                  onChange={(e:any) => setName(e.target.value)}
                  value={name}
                />
              </Box>
              <Box padding={4}>
                <Button marginBottom={0} type="submit" variant="secondary" startIcon={<Plus/>}>
                        Create Backup
                </Button>
              </Box>
            </Flex>
          </Box>

          <Box>
            <Flex>
              <Box>
                <TextInput fullWidth
                  placeholder="Enter backup name..."
                  label="Restore"
                  type="file"
                  hint="Select a backup file..."
                  onChange={(e:any) => setFileName(e.target.files[0])}
                />
              </Box>
              <Box padding={4}>
                <Button marginBottom={0} onClick={() => setShowModal(true)} variant="secondary" startIcon={<Plus/>}>
                        Restore Backup
                </Button>
              </Box>
            </Flex>
          </Box>

          {fileList.length===0 ? (
            <EmptyStateLayout
              icon={<BlankPageBgIcon/>}
              content="You don't have any backups yet..."
            />
          ) : (
            <>
              <TotalFileCount count={fileList.length}/>
              <FileTable fileList={fileList} deleteFile={deleteFile} downloadLink={downloadLink}/>
            </>
          )}
          
        </ContentLayout>
        {showModal && <TodoModal restoring={restoring} setShowModal={setShowModal} fileName={fileName} fetchFileList={fetchFileList} handleError={handleError}/>}
    </>
  );
};

export default HomePage;
