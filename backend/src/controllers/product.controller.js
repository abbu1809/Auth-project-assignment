import productModel from '../models/product.model.js';
import { uploadFileToImageKit } from '../services/storage.service.js';
export const createProductController = async (req, res) => {
  console.log('req.body', req.body);
  console.log('req.files', req.files);
  const fileUrls = await Promise.all(
    (req.files ?? []).map(async (file, index) => {
      const response = await uploadFileToImageKit({
        buffer: file.buffer,
        fileName: `${file.originalname}-${Date.now()}-${index}`,
      });
      return response.url;
    })
  );
  console.log('fileUrls', fileUrls);
  const product = await productModel.create({
    title: req.body.title,
    description: req.body.description,
    price: {
      amount: req.body.price.amount,
      currency: req.body.price.currency,
    },
    sizes: req.body.sizes,
    images: fileUrls,
    seller: req.user.userId,
  });

  res.status(201).json({
    message: 'Product created successfully',
    data: {
      product,
    },
  });
};

export const listAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find({
      published: true,
    });
    res.status(200).json({
      message: 'Products fetched successfully',
      data: {
        products,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const listProductByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id, {
      published: true,
    });
    res.status(200).json({
      message: 'Product fetched successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const listAllProductToSellerController = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      message: 'Products fetched successfully',
      data: {
        products,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};
export const unlistProductController = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  if (product.seller.toString() !== req.user.userId) {
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to unlist this product',
    });
  }
  await productModel.findByIdAndUpdate(id, { published: false });

  res.status(200).json({
    message: 'Product unlisted successfully',
  });
};

export const listProductController = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  if (product.seller.toString() !== req.user.userId) {
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to unlist this product',
    });
  }
  await productModel.findByIdAndUpdate(id, { published: true });

  res.status(200).json({
    message: 'Product listed successfully',
  });
};

export const updateProductController = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  if (product.seller.toString() !== req.user.userId) {
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to update this product',
    });
  }

  const fileUrls = await Promise.all(
    (req.files ?? []).map(async (file, index) => {
      const response = await uploadFileToImageKit({
        buffer: file.buffer,
        fileName: `${file.originalname}-${Date.now()}-${index}`,
      });
      return response.url;
    })
  );

  const updatedProduct = await productModel.findByIdAndUpdate(
    id,
    {
      ...req.body,
      images: [...product.images, ...fileUrls],
    },
    { new: true }
  );

  res.status(200).json({
    message: 'Product updated successfully',
    data: {
      product: updatedProduct,
    },
  });
};

export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  if (product.seller.toString() !== req.user.userId) {
    return res.status(403).json({
      message: 'Forbidden: You do not have permission to delete this product',
    });
  }

  await productModel.findByIdAndDelete(id);

  res.status(200).json({
    message: 'Product deleted successfully',
  });
};
