import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Spinner,
  Grid,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { useQuery } from "react-query";

import ProductCard from "./ProductCard";
import AddProductModal from "./AddProductModal";

const ProductsContainer = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading, data } = useQuery("getProducts", async () => {
    const data = await fetch("http://localhost:7070/api/product/").then((res) =>
      res.json()
    );
    return data;
  });
  return (
    <Box mx={"auto"} maxW={"container.lg"}>
      <Flex justifyContent={"flex-end"} p={4}>
        <Button
          variant={"solid"}
          colorScheme={"teal"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={() => {
            setSelectedProduct(null);
            onOpen();
          }}
        >
          Add new Product
        </Button>
      </Flex>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
        px={{ base: "2rem", md: "0" }}
        gap={2}
        py={2}
      >
        {isLoading && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}
        {!isLoading &&
          data &&
          data.map((el, index) => (
            <ProductCard
              key={index}
              {...el}
              onOpenModal={() => {
                setSelectedProduct(el);
                onOpen();
              }}
            />
          ))}
      </Grid>
      <AddProductModal
        isOpen={isOpen}
        onClose={onClose}
        product={selectedProduct}
      />
    </Box>
  );
};

export default ProductsContainer;
