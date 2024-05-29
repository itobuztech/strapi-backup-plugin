import { Table, Thead, Tbody, Tr, Td, Th, Typography, Flex, IconButton, Box } from "@strapi/design-system";
import {Trash, Download} from "@strapi/icons";
import React from "react";

interface fileProps {
    fileList: String[],
    deleteFile: any,
    downloadLink: any
}

const FileTable: React.FC<fileProps> = ({fileList, deleteFile, downloadLink}) => {
    return(
        <>
            <Table>
                <Thead>
                    <Th><Box padding={4}><Typography textColor="neutral800" variant="sigma">S.No</Typography></Box></Th>
                    <Th><Box padding={4}><Typography textColor="neutral800" variant="sigma">Name</Typography></Box></Th>
                    <Th><Box padding={4}><Typography textColor="neutral800" variant="sigma">Size</Typography></Box></Th>
                    <Th><Box padding={4}><Typography textColor="neutral800" variant="sigma">Created At</Typography></Box></Th>
                    <Th><Box padding={4}><Typography textColor="neutral800" variant="sigma">Download</Typography></Box></Th>
                    <Th><Box padding={4}><Typography textColor="neutral800" variant="sigma">Trash</Typography></Box></Th>
                </Thead>
                <Tbody>
                    {fileList.map((file:any, index:number, arr:any)=>{
                        const createdAt = new Date(file.created);
                        const createdAt_formated = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(createdAt);

                        return(
                            <Tr>
                                <Td><Box padding={0}><Typography textColor="neutral800">{++index}</Typography></Box></Td>
                                <Td><Box padding={0}><Typography textColor="neutral800">{file.name}</Typography></Box></Td>
                                <Td><Box padding={0}><Typography textColor="neutral800">{(file.size/(1024*1024)).toFixed(2)}{' MB'}</Typography></Box></Td>
                                <Td><Box padding={0}><Typography textColor="neutral800">{createdAt_formated}</Typography></Box></Td>
                                <Td>
                                    <Box paddingLeft={2}>
                                        <Flex style={{ justifyContent: "start" }}>
                                            <IconButton
                                            onClick={()=> downloadLink(file.name)}
                                            label="Download"
                                            noBorder
                                            icon={<Download />}
                                            />
                                        </Flex>
                                    </Box>
                                </Td>
                                <Td>
                                    <Box paddingLeft={2}>
                                        <Flex style={{ justifyContent: "start" }}>
                                            <IconButton
                                            onClick={()=> deleteFile(file.name)}
                                            label="Delete"
                                            noBorder
                                            icon={<Trash />}
                                            />
                                        </Flex>
                                    </Box>
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </>
    );
}

export {FileTable};