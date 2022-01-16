import React, { useState } from "react";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  ModalFooter,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(40, "Too Long!")
    .required("Required"),
  description: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  price: Yup.number().required("Required"),
  image: Yup.mixed().required("Required"),
});

const AddProductModal = ({ isOpen, onClose, product }) => {
  const isAddMode = !product;
  const queryClient = useQueryClient();
  const [generalError, setGeneralError] = useState(null);
  const mutation = useMutation((saveProduct) => {
    const data = new FormData();
    data.append("image", saveProduct.image);
    data.append("name", saveProduct.name);
    data.append("price", saveProduct.price);
    data.append("description", saveProduct.description);
    const url = isAddMode
      ? "http://localhost:7070/api/product/"
      : `http://localhost:7070/api/product/${saveProduct.id}/`;
    fetch(url, {
      method: isAddMode ? "POST" : "PUT",
      body: data,
    })
      .then((res) => {
        if (res.ok) {
          queryClient.invalidateQueries("getProducts");
          onClose();
        } else {
          return res.json().then((response) => {
            throw new Error(JSON.stringify(response));
          });
        }
      })
      .catch((error) => setGeneralError(error.message));
  });

  const getFileForImage = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    return file;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isAddMode ? "Add new product" : "Edit Product"}
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            name: isAddMode ? "" : product.name,
            price: isAddMode ? "" : product.price,
            description: isAddMode ? "" : product.description,
            image: isAddMode ? null : product.image,
          }}
          validationSchema={ProductSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (isAddMode) mutation.mutate(values);
            else {
              if (values.image instanceof File)
                mutation.mutate({ ...values, id: product.id });
              else
                getFileForImage(values.image).then((res) => {
                  mutation.mutate({ ...values, image: res, id: product.id });
                });
            }
          }}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            touched,
          }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody>
                {generalError && (
                  <Alert status="error">
                    <AlertIcon />
                    {generalError}
                  </Alert>
                )}
                <FormControl isInvalid={touched.name && errors.name}>
                  <FormLabel htmlFor="name">Product name</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={touched.description && errors.description}
                >
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Input
                    id="description"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={touched.price && errors.price}>
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <Input
                    id="price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormErrorMessage>{errors.price}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={touched.image && errors.image}>
                  <FormLabel htmlFor="image">Image</FormLabel>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={(event) => {
                      setFieldValue("image", event.target.files[0]);
                    }}
                  />
                  <FormErrorMessage>{errors.image}</FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  variant="solid"
                  disabled={isSubmitting}
                >
                  {isAddMode ? "Add" : "Edit"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
