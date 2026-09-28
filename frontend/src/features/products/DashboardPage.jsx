import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useProducts, useProductMutations } from './productsApi';
import ProductForm from './ProductForm';

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user);
  const canManageProducts = user?.role === 'seller';
  const { data, isLoading, isError } = useProducts();
  const { create, update, remove } = useProductMutations();
  const [editing, setEditing] = useState(null);
  const products = data?.data?.products || [];

  const save = async (values, files) => {
    if (editing?._id)
      await update.mutateAsync({ id: editing._id, values, files });
    else await create.mutateAsync({ values, files });
    setEditing(null);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product permanently?'))
      await remove.mutateAsync(id);
  };

  return (
    <div className="dashboard">
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">
            {canManageProducts ? 'Seller studio / inventory' : 'Catalog'}
          </p>
          <h1>What’s on the shelf?</h1>
          <p className="muted">
            {canManageProducts
              ? 'Keep your catalog considered and current.'
              : 'Browse the current product catalog.'}
          </p>
        </div>
        {canManageProducts && (
          <button
            className="primary-button add-button"
            onClick={() => setEditing({})}
          >
            <Plus size={18} /> Add product
          </button>
        )}
      </section>
      {canManageProducts && editing && (
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
          <ProductForm
            product={editing._id ? editing : null}
            onSubmit={save}
            busy={create.isPending || update.isPending}
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
              onEdit={canManageProducts ? () => setEditing(product) : undefined}
              onDelete={canManageProducts ? () => deleteProduct(product._id) : undefined}
              canManage={canManageProducts}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete, canManage }) {
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
      {canManage && (
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
      )}
    </article>
  );
}
