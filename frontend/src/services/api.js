import axios from 'axios';

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const client = axios.create({
  withCredentials: true,
  baseURL: apiUrl,
});

export const apiRequest = async (path, options = {}) => {
  const accessToken = sessionStorage.getItem('accessToken');
  const { body, ...requestOptions } = options;

  try {
    const response = await client({
      url: path,
      ...requestOptions,
      data: body,
      headers: {
        ...(body instanceof FormData
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(options.headers || {}),
      },
    });
    return response.data;
  } catch (requestError) {
    const payload = requestError.response?.data || {};
    const error = new Error(payload.message || 'Something went wrong');
    error.fields = Object.fromEntries(
      (payload.errors || []).map((item) => [item.path, item.msg])
    );
    throw error;
  }
};

export const authApi = {
  register: (values) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(values),
    }),
  login: (values) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(values),
    }),
  me: () => apiRequest('/api/auth/me'),
  refresh: () => apiRequest('/api/auth/refresh', { method: 'POST' }),
  logout: () => apiRequest('/api/auth/logout', { method: 'GET' }),
};

const productFormData = (values, files) => {
  const form = new FormData();
  form.append('title', values.title);
  form.append('description', values.description);
  form.append(
    'price',
    JSON.stringify({ amount: Number(values.amount), currency: values.currency })
  );
  form.append('sizes', JSON.stringify(values.sizes));
  Array.from(files || []).forEach((file) => form.append('images', file));
  return form;
};

export const productsApi = {
  list: () => apiRequest('/api/products'),
  get: (id) => {
    if (!id) throw new Error('Product id is required');
    return apiRequest(`/api/products/${id}`);
  },
  create: (values, files) =>
    apiRequest('/api/products', {
      method: 'POST',
      body: productFormData(values, files),
    }),
  update: (id, values, files) => {
    if (!id) throw new Error('Product id is required');
    return apiRequest(`/api/products/update/${id}`, {
      method: 'PUT',
      body: productFormData(values, files),
    });
  },
  remove: (id) => {
    if (!id) throw new Error('Product id is required');
    return apiRequest(`/api/products/delete/${id}`, { method: 'DELETE' });
  },
};
