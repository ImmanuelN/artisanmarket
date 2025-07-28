import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal } from '../../../components/ui';
import { PlusIcon, PhotoIcon, PencilIcon, TrashIcon, EyeIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline';
import ProductForm from '../../../components/forms/ProductForm';

interface Product {
  _id: string;
  title: string;
  price: number;
  images: { url: string }[];
  status: string;
  inventory: { quantity: number };
  description: string;
  categories: string[];
  shortDescription?: string;
  comparePrice?: number;
}

interface ProductManagementTabProps {
  onAddProduct: () => void;
  products: Product[];
  onUpdateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

const ProductManagementTab: React.FC<ProductManagementTabProps> = ({
  onAddProduct,
  products,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteConfirmProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (formData: Partial<Product>) => {
    if (editingProduct) {
      await onUpdateProduct(editingProduct._id, formData);
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmProduct) {
      await onDeleteProduct(deleteConfirmProduct._id);
      setIsDeleteModalOpen(false);
      setDeleteConfirmProduct(null);
    }
  };

  const handleStatusToggle = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    await onUpdateProduct(product._id, { status: newStatus });
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
        <Button onClick={onAddProduct}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <Card.Content>
            <div className="text-center py-12">
              <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first product to your store.</p>
              <Button onClick={onAddProduct}>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Product
              </Button>
            </div>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="relative aspect-w-16 aspect-h-9">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                  alt={product.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant={product.status === 'active' ? 'success' : 'secondary'}
                    size="sm"
                    onClick={() => handleStatusToggle(product)}
                    className="!px-2 !py-1 text-xs font-medium"
                  >
                    {product.status === 'active' ? 'Active' : 'Inactive'}
                  </Button>
                </div>
              </div>
              <Card.Content className="p-3">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{product.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 h-8">{product.description}</p>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <div className="flex items-center">
                      <TagIcon className="w-3 h-3 mr-1" />
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {product.inventory.quantity} in stock
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                      >
                        {category}
                      </span>
                    ))}
                    {product.categories.length > 2 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        +{product.categories.length - 2}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProduct(product._id)}
                        className="!p-1.5"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(product)}
                        className="!p-1.5"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                      className="!p-1.5"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        size="3xl"
      >
        <div className="p-6">
          {editingProduct && (
            <ProductForm
              initialValues={editingProduct}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditModalOpen(false)}
              submitButtonText="Save Changes"
            />
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmProduct(null);
        }}
        title="Confirm Delete"
        size="md"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Product</h3>
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete "{deleteConfirmProduct?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagementTab; 