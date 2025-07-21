import React, { useState } from 'react';
import { Input, Button, Badge } from '../ui';
import { PhotoIcon, XCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

const steps = ["Basic Details", "Categorization", "Product Images"];

const schema = yup.object().shape({
  title: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  inventoryQuantity: yup
    .number()
    .typeError('Inventory quantity must be a number')
    .integer('Inventory quantity must be an integer')
    .min(1, 'Inventory quantity must be at least 1')
    .required('Inventory quantity is required'),
  categories: yup
    .array()
    .of(yup.string())
    .min(1, 'Select at least one category')
    .required('Category is required'),
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().required(),
        alt: yup.string(),
        isPrimary: yup.boolean(),
      })
    )
    .min(3, 'Upload at least 3 images')
    .required('Images are required'),
});

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, product = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<ProductData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || '',
      categories: product?.categories || [],
      images: product?.images || [],
      inventoryQuantity: (product as any)?.inventory?.quantity || 1,
    },
  });

  // --- Image Handlers ---
  const handleImageUpload = (files: FileList | File[]) => {
    const fileArr = Array.from(files).slice(0, 10 - getValues('images').length);
    fileArr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setValue('images', [
          ...getValues('images'),
          {
            url: ev.target?.result as string,
            alt: getValues('title') || file.name,
            isPrimary: getValues('images').length === 0,
          },
        ], { shouldValidate: true });
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
    const images = Array.from(getValues('images'));
    const [removed] = images.splice(result.source.index, 1);
    images.splice(result.destination!.index, 0, removed);
    setValue('images', images.map((img, idx) => ({ ...img, isPrimary: idx === 0 })), { shouldValidate: true });
  };

  // --- Step Navigation ---
  const canProceed = async () => {
    if (currentStep === 1) {
      return await trigger(['title', 'description', 'price', 'inventoryQuantity']);
    }
    if (currentStep === 2) {
      return await trigger(['categories']);
    }
    if (currentStep === 3) {
      return await trigger(['images']);
    }
    return true;
  };

  const nextStep = async () => {
    const valid = await canProceed();
    if (valid) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Progress Bar */}
      <div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div key={step} className="text-center">
              <p className={`text-sm ${index + 1 <= currentStep ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>{step}</p>
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
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-8 bg-white rounded-xl shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{steps[0]}</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Product Name <span className="text-red-500">*</span></label>
                        <Input {...field} className={errors.title ? 'border-red-500' : ''} placeholder="e.g. Modern Ceramic Vase" />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                      </div>
                    )}
                  />
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Price ($) <span className="text-red-500">*</span></label>
                        <Input {...field} type="number" className={errors.price ? 'border-red-500' : ''} placeholder="e.g. 49.99" />
                        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                      </div>
                    )}
                  />
                  <Controller
                    name="inventoryQuantity"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Inventory Quantity <span className="text-red-500">*</span></label>
                        <Input {...field} type="number" min={1} className={errors.inventoryQuantity ? 'border-red-500' : ''} placeholder="e.g. 10" />
                        {errors.inventoryQuantity && <p className="text-xs text-red-500 mt-1">{errors.inventoryQuantity.message}</p>}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4 h-full flex flex-col">
                        <label className="block text-sm font-medium mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea {...field} rows={7} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.description ? 'border-red-500' : ''}`} placeholder="Describe your product..." />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Categorization */}
          {currentStep === 2 && (
            <div className="space-y-8 bg-white rounded-xl shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{steps[1]}</h3>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                      {categories.map((cat) => (
                        <Badge
                          key={cat}
                          variant={field.value.includes(cat) ? 'primary' : 'outline'}
                          onClick={() => {
                            if (field.value.includes(cat)) {
                              field.onChange(field.value.filter((c: string) => c !== cat));
                            } else {
                              field.onChange([...field.value, cat]);
                            }
                          }}
                          className={`cursor-pointer transition-transform transform hover:scale-105 ${errors.categories ? 'border-red-500' : ''}`}
                          size="lg"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    {errors.categories && <p className="text-xs text-red-500 mt-1">{errors.categories.message}</p>}
                  </div>
                )}
              />
            </div>
          )}

          {/* Step 3: Product Images */}
          {currentStep === 3 && (
            <div className="space-y-8 bg-white rounded-xl shadow p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{steps[2]}</h3>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Images <span className="text-red-500">*</span></label>
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
                        disabled={field.value.length >= 10}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('product-image-upload')?.click()}
                        disabled={field.value.length >= 10}
                      >
                        {field.value.length >= 10 ? 'Max 10 Images' : 'Upload Images'}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">Minimum 3, maximum 10 images. The first image is the cover.</p>
                    </div>
                    {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images.message}</p>}
                    {field.value.length > 0 && (
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="images-droppable" direction="horizontal">
                          {(provided, snapshot) => (
                            <div
                              className="flex gap-4 mt-4 overflow-x-auto"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {field.value.map((image, index) => (
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
                                        onClick={() => {
                                          const newImages = [...field.value];
                                          newImages.splice(index, 1);
                                          field.onChange(newImages.map((img, idx) => ({ ...img, isPrimary: idx === 0 })));
                                        }}
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
                )}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
        <div>
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
          )}
        </div>
        <div>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          {currentStep < steps.length && (
            <Button type="button" onClick={nextStep} className="ml-3">Next</Button>
          )}
          {currentStep === steps.length && (
            <Button type="submit" className="ml-3">Save Product</Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProductForm; 