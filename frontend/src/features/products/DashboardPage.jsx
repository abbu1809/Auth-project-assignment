import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useProducts, useProductMutations } from './productsApi';
import ProductForm from './ProductForm';

export default function DashboardPage() {
  const { data, isLoading, isError } = useProducts();
  const { create, update, remove } = useProductMutations();
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState('');
  const [serverErrors, setServerErrors] = useState({});
  const products = data?.data?.products || [];

  const save = async (values, files) => {
    try {
      setFormError('');
      setServerErrors({});
      if (editing) await update.mutateAsync({ id: editing._id, values, files });
      else await create.mutateAsync({ values, files });
      setEditing(null);
    } catch (error) {
      setFormError(error.message);
      setServerErrors(normalizeFieldErrors(error.fields));
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      setFormError('');
      await remove.mutateAsync(id);
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <div className="dashboard">
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Seller studio / inventory</p>
          <h1>What’s on the shelf?</h1>
          <p className="muted">Keep your catalog considered and current.</p>
        </div>
        <button
          className="primary-button add-button"
          onClick={() => setEditing({})}
        >
          <Plus size={18} /> Add product
        </button>
      </section>
      {editing && (
        <section className="editor">
          <div className="editor-head">
            <div>
              <p className="eyebrow">
                {editing._id ? 'Edit listing' : 'New listing'}
              </p>
              <h2>{editing._id ? editing.title : 'Add something new'}</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => setEditing(null)}
              aria-label="Close editor"
            >
              <X size={20} />
            </button>
          </div>
          {formError && <p className="form-error">{formError}</p>}
          <ProductForm
            product={editing._id ? editing : null}
            onSubmit={save}
            busy={create.isPending || update.isPending}
            serverErrors={serverErrors}
          />
        </section>
      )}
      <section className="catalog-section">
        <div className="section-label">
          <span>All products</span>
          <span>{products.length.toString().padStart(2, '0')} items</span>
        </div>
        {isLoading && (
          <div className="empty-state">Loading your catalog...</div>
        )}
        {isError && (
          <div className="empty-state">
            Could not load products. Check that the API is running.
          </div>
        )}
        {!isLoading && !isError && products.length === 0 && (
          <div className="empty-state">
            Your shelf is empty. Add the first product.
          </div>
        )}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => setEditing(product)}
              onDelete={() => deleteProduct(product._id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function normalizeFieldErrors(fields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([field, message]) => [
      field
        .replace(/^price\.amount$/, 'amount')
        .replace(/^sizes\[(\d+)\]\./, 'sizes.$1.'),
      message,
    ])
  );
}

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <div className="product-image">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} />
        ) : (
          <span>{product.title?.slice(0, 1)}</span>
        )}
        <span className={`status ${product.published ? 'live' : ''}`}>
          {product.published ? 'Published' : 'Draft'}
        </span>
      </div>
      <div className="product-info">
        <div>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>
        <strong>
          {product.price?.currency} {product.price?.amount}
        </strong>
      </div>
      <div className="card-actions">
        <button className="small-button" onClick={onEdit}>
          <Pencil size={14} /> Edit
        </button>
        <button
          className="danger-button"
          onClick={onDelete}
          aria-label={`Delete ${product.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
