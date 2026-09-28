import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

const defaultValues = {
  title: '',
  description: '',
  amount: '',
  currency: 'INR',
  sizes: [{ size: 'M', stock: 0 }],
};

export default function ProductForm({ product, onSubmit, busy }) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: getDefaultValues(product),
  });
  const { fields } = useFieldArray({ control, name: 'sizes' });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    reset(getDefaultValues(product));
    setFiles([]);
  }, [product, reset]);

  const submit = (values) => onSubmit(values, files);

  return (
    <form className="product-form" onSubmit={handleSubmit(submit)}>
      <div className="form-columns">
        <label className="field">
          <span>Product name</span>
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 2, message: 'Title must be at least 2 characters' },
              maxLength: { value: 100, message: 'Title must be at most 100 characters' },
            })}
          />
          {errors.title && <small>{errors.title.message}</small>}
        </label>
        <label className="field">
          <span>Price</span>
          <div className="price-input">
            <select {...register('currency', { required: 'Currency is required' })}>
              <option>INR</option>
              <option>USD</option>
            </select>
            <input
              type="number"
              min="0"
              {...register('amount', {
                required: 'Price is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Price must be positive' },
              })}
            />
          </div>
          {errors.amount && <small>{errors.amount.message}</small>}
        </label>
      </div>
      <label className="field">
        <span>Description</span>
        <textarea
          rows="4"
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 20, message: 'Description must be at least 20 characters' },
            maxLength: { value: 500, message: 'Description must be at most 500 characters' },
          })}
        />
        {errors.description && <small>{errors.description.message}</small>}
      </label>
      <div className="size-row">
        <span className="field-label">Sizes & stock</span>
        {fields.map((field, index) => (
          <div className="size-input" key={field.id}>
            <select
              {...register(`sizes.${index}.size`, { required: 'Size is required' })}
            >
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
            </select>
            <input
              type="number"
              min="0"
              {...register(`sizes.${index}.stock`, {
                required: 'Stock is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Stock cannot be negative' },
              })}
            />
          </div>
        ))}
        {errors.sizes?.[0]?.stock && <small>{errors.sizes[0].stock.message}</small>}
      </div>
      <label className="field file-field">
        <span>Product images</span>
        <input
          type="file"
          accept="image/*"
          multiple
          {...register('images', {
            onChange: (event) => setFiles(event.target.files),
          })}
        />
      </label>
      <button className="primary-button" disabled={busy}>
        {busy ? 'Saving...' : product ? 'Save changes' : 'Publish product'}
      </button>
    </form>
  );
}

function getDefaultValues(product) {
  return product
    ? {
        title: product.title || '',
        description: product.description || '',
        amount: product.price?.amount ?? '',
        currency: product.price?.currency || 'INR',
        sizes: product.sizes?.map((item) => ({
          size: item.size,
          stock: item.stock,
        })) || defaultValues.sizes,
      }
    : defaultValues;
}
