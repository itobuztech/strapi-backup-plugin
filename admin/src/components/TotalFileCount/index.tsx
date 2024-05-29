// @ts-nocheck
import React from "react";
import { Box, Flex, Typography } from "@strapi/design-system";

const TotalFileCount = ({ count }) => {
  return (
    <Box background="neutral0" hasRadius={true} shadow="filterShadow" marginBottom={4}>
      <Flex justifyContent="center" padding={4}>
        <Typography variant="beta">
         ⚡️ You have a total of {count} backup files ⚡️
        </Typography>
      </Flex>
    </Box>
  );
}

export {TotalFileCount};