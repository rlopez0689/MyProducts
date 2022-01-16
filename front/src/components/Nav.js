import React from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";

const Nav = () => (
  <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
    <Flex h={16} alignItems={"center"} justifyContent={"center"}>
      <Box>My Products</Box>
    </Flex>
  </Box>
);

export default Nav;
