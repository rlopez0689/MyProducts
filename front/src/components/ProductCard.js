import React from "react";

import {
  Box,
  Flex,
  useColorModeValue,
  Image,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const ProductCard = ({ id, name, description, price, image, onOpenModal }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => {
    fetch(`http://localhost:7070/api/product/${id}`, {
      method: "DELETE",
    }).then((res) => queryClient.invalidateQueries("getProducts"));
  });
  return (
    <Box
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"lg"}
      zIndex={1}
    >
      <Flex justifyContent={"flex-end"} m={2}>
        <DeleteIcon
          cursor={"pointer"}
          color={"gray.400"}
          onClick={() => mutation.mutate()}
        />
        <EditIcon
          ml={1}
          cursor={"pointer"}
          color={"gray.400"}
          onClick={onOpenModal}
        />
      </Flex>
      <Box p={6}>
        <Flex justifyContent={"center"} rounded={"lg"}>
          <Image
            w={"220px"}
            h={"220px"}
            rounded={"lg"}
            objectFit={"cover"}
            src={image}
          />
        </Flex>
        <Stack pt={10} align={"center"}>
          <Text color={"gray.500"} fontSize={"md"} textTransform={"uppercase"}>
            {name}
          </Text>
          <Heading fontSize={"sm"} fontFamily={"body"} fontWeight={300}>
            {description}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={800} fontSize={"md"}>
              ${price}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductCard;
