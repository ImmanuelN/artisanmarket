import React from 'react';
import { Button, Card } from '../../../components/ui';
import { PlusIcon, PhotoIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// A basic product type, expand as needed
interface Product {
  _id: string;
  title: string;
  price: number;
  images: { url: string }[];
  status: string;
  inventory: { quantity: number };
}

interface ProductManagementTabProps {
  onAddProduct: () => void;
  products: Product[];
}

const ProductManagementTab: React.FC<ProductManagementTabProps> = ({ onAddProduct, products }) => {
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
        <Card>
          <Card.Content>
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product._id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                      alt={product.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <p className="text-sm text-gray-500">Stock: {product.inventory.quantity}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status}
                    </span>
                    <Button variant="outline" size="md">
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                     <Button variant="destructive" size="md">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default ProductManagementTab; 