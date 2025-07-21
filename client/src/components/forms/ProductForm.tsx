import React, { useState } from 'react';
import { Input, Button, Badge } from '../ui';
import { PhotoIcon, XCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Define a type for the product data for better type safety
interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

interface ProductData {
  title: string;
  description: string;
  price: number | string;
  categories: string[];
  images: ProductImage[];
  inventoryQuantity: number | string;
}

interface ProductFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  product?: ProductData | null;
}

const categories = [
  'Ceramics', 'Textiles', 'Jewelry', 'Leather Goods', 'Woodwork', 
  'Metalwork', 'Glass', 'Paintings', 'Sculptures', 'Home Decor', 
  'Accessories', 'Toys', 'Other'
];

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, product = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductData>({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    categories: product?.categories || [],
    images: product?.images || [],
    inventoryQuantity: (product as any)?.inventory?.quantity || 1,
  });
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handleImageUpload = (files: FileList | File[]) => {
    const fileArr = Array.from(files).slice(0, 10 - formData.images.length);
    fileArr.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => {
          if (prev.images.length >= 10) return prev;
          const isPrimary = prev.images.length === 0;
          return {
            ...prev,
            images: [
              ...prev.images,
              {
                url: ev.target?.result as string,
                alt: prev.title || file.name,
                isPrimary,
              },
            ],
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setFormData((prev) => {
      const newImages = Array.from(prev.images);
      const [removed] = newImages.splice(result.source.index, 1);
      newImages.splice(result.destination!.index, 0, removed);
      // Update isPrimary: only first image is true
      return {
        ...prev,
        images: newImages.map((img, idx) => ({ ...img, isPrimary: idx === 0 })),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.images.length < 3) {
      alert('Please upload at least 3 images.');
      return;
    }
    if (!formData.inventoryQuantity || isNaN(Number(formData.inventoryQuantity)) || Number(formData.inventoryQuantity) < 1) {
      alert('Please enter a valid inventory quantity (minimum 1).');
      return;
    }
    // Convert categories to kebab-case
    const kebabCategories = formData.categories.map(cat => cat.toLowerCase().replace(/\s+/g, '-'));
    // Ensure images are objects with url, alt, isPrimary
    const images = formData.images.map((img, idx) => ({
      url: img.url,
      alt: img.alt || formData.title,
      isPrimary: idx === 0,
    }));
    const submitData = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      categories: kebabCategories,
      images,
      inventory: { quantity: Number(formData.inventoryQuantity) },
    };
    onSubmit(submitData);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const moveImage = (from: number, to: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const [moved] = newImages.splice(from, 1);
      newImages.splice(to, 0, moved);
      return { ...prev, images: newImages };
    });
  };

  const steps = ["Basic Details", "Categorization", "Product Images"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={step} className="text-center">
              <p className={`text-sm ${index + 1 <= currentStep ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">{steps[0]}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <Input name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <Input name="price" type="number" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inventory Quantity</label>
                <Input
                  name="inventoryQuantity"
                  type="number"
                  min={1}
                  value={formData.inventoryQuantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">{steps[1]}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={formData.categories.includes(cat) ? 'primary' : 'outline'}
                      onClick={() => handleCategoryChange(cat)}
                      className="cursor-pointer transition-transform transform hover:scale-105"
                      size="lg"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">{steps[2]}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div
                  className={`w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${dragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-gray-50'}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">Drag and drop images here, or</p>
                  <input
                    type="file"
                    accept="image/*"
                    id="product-image-upload"
                    className="hidden"
                    multiple
                    onChange={handleImageInputChange}
                    disabled={formData.images.length >= 10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('product-image-upload')?.click()}
                    disabled={formData.images.length >= 10}
                  >
                    {formData.images.length >= 10 ? 'Max 10 Images' : 'Upload Images'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Minimum 3, maximum 10 images. The first image is the cover.</p>
                </div>
                {formData.images.length > 0 && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="images-droppable" direction="horizontal">
                      {(provided, snapshot) => (
                        <div
                          className="flex gap-4 mt-4 overflow-x-auto"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {formData.images.map((image, index) => (
                            <Draggable key={image.url || index} draggableId={image.url || `img-${index}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`relative flex flex-col items-center border rounded-lg p-2 bg-white shadow-sm ${index === 0 ? 'border-amber-500 border-2' : 'border-gray-200'} ${snapshot.isDragging ? 'ring-2 ring-amber-400' : ''}`}
                                  style={{ minWidth: 96, minHeight: 96 }}
                                >
                                  <img src={image.url || ''} alt={image.alt || `Product image ${index + 1}`} className="object-cover w-24 h-24 rounded mb-2" />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setFormData((prev) => {
                                      const newImages = [...prev.images];
                                      newImages.splice(index, 1);
                                      // Update isPrimary
                                      return {
                                        ...prev,
                                        images: newImages.map((img, idx) => ({ ...img, isPrimary: idx === 0 })),
                                      };
                                    })}
                                  >
                                    <XCircleIcon className="w-5 h-5" />
                                  </Button>
                                  {index === 0 && (
                                    <span className="absolute top-1 left-1 flex items-center text-amber-600 font-semibold text-xs bg-white bg-opacity-80 px-1 rounded"><StarIcon className="w-4 h-4 mr-1" /> Cover</span>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
        <div>
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
          )}
        </div>
        <div>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          {currentStep < totalSteps && (
            <Button type="button" onClick={nextStep} className="ml-3">Next</Button>
          )}
          {currentStep === totalSteps && (
            <Button type="submit" className="ml-3">Save Product</Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProductForm; 