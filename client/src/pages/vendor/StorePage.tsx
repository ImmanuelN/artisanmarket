import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Badge, Button, ProductCard } from '../../components/ui';
import api from '../../utils/api';
import { Building } from 'lucide-react';
import { CheckCircle, Clock, XCircle, Shield } from 'lucide-react';
import { Store } from '../../types/stores';
import StoreLogo from '../../components/ui/StoreLogo';
import StoreBanner from '../../components/ui/StoreBanner';

const StorePage = () => {
  const { vendorId } = useParams();
  const [profile, setProfile] = useState<Store | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        // Fetch vendor profile
        const res = await api.get(`/vendors/public/${vendorId}`);
        setProfile(res.data.profile);
        // Fetch products for this vendor
        const prodRes = await api.get(`/products?vendor=${vendorId}`);
        setProducts(prodRes.data.products || []);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    if (vendorId) fetchStore();
  }, [vendorId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Store not found.</div>;

  // Banner and logo
  const bannerUrl = profile.banner;
  const logoUrl = profile.logo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Banner */}
      <div className="relative w-full h-56 md:h-72 bg-gray-200">
        <StoreBanner src={bannerUrl} />
        {/* Logo over banner */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
          <StoreLogo src={logoUrl} sizeClass="w-40 h-40" />
        </div>
      </div>
      <Container className="pt-20 pb-8">
        {/* Store Name & Description */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{profile.storeName}</h1>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {/* Verification badge */}
            {profile.verification?.status && (
              <span className="inline-flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                  ${profile.verification.status === 'approved' ? 'bg-green-100 text-green-700' :
                    profile.verification.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    profile.verification.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'}`}
                >
                  {profile.verification.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                  {profile.verification.status === 'pending' && <Clock className="w-4 h-4" />}
                  {profile.verification.status === 'rejected' && <XCircle className="w-4 h-4" />}
                  {['approved','pending','rejected'].indexOf(profile.verification.status) === -1 && <Shield className="w-4 h-4" />}
                  {profile.verification.status === 'approved' ? 'Verified Vendor' :
                    profile.verification.status.charAt(0).toUpperCase() + profile.verification.status.slice(1)}
                </span>
              </span>
            )}
          </div>
          <p className="text-lg text-gray-600 mb-1">{profile.storeDescription}</p>
          {/* Member since */}
          <div className="text-sm text-gray-500 mb-2">
            Member since {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {profile.specialties && profile.specialties.map((cat: string) => (
              <Badge key={cat} color="info">{cat}</Badge>
            ))}
          </div>
        </div>
        {/* About & Contact Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {/* About */}
          <Card className="md:col-span-2">
            <Card.Header>
              <Card.Title>About This Store</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="text-gray-700 whitespace-pre-line">
                {profile.storeDescription || 'No description available.'}
              </div>
              {profile.craftsmanship && (
                <div className="mt-4">
                  <div className="font-semibold mb-1">Craftsmanship</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.craftsmanship.yearsOfExperience && (
                      <Badge color="info">{profile.craftsmanship.yearsOfExperience} yrs experience</Badge>
                    )}
                    {profile.craftsmanship.techniques && profile.craftsmanship.techniques.map((t: string) => (
                      <Badge key={t} color="info">{t}</Badge>
                    ))}
                    {profile.craftsmanship.materials && profile.craftsmanship.materials.map((m: string) => (
                      <Badge key={m} color="info">{m}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
          {/* Contact & Social */}
          <Card>
            <Card.Header>
              <Card.Title>Contact & Info</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                {profile.contact?.email && <div><span className="font-semibold">Email:</span> <a href={`mailto:${profile.contact.email}`} className="text-amber-600 hover:underline">{profile.contact.email}</a></div>}
                {profile.contact?.phone && <div><span className="font-semibold">Phone:</span> <a href={`tel:${profile.contact.phone}`} className="text-amber-600 hover:underline">{profile.contact.phone}</a></div>}
                {profile.contact?.website && (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      let url = profile.contact.website || '';
                      if (!/^https?:\/\//i.test(url)) {
                        url = 'https://' + url;
                      }
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Visit Website
                  </Button>
                )}
                {profile.business?.address && (
                  <div><span className="font-semibold">Location:</span> {profile.business.address.city}, {profile.business.address.country}</div>
                )}
                {/* Social Media */}
                {profile.contact?.socialMedia && (
                  <div className="flex gap-2 mt-2">
                    {Object.entries(profile.contact.socialMedia).map(([platform, url], idx) => (
                      typeof url === 'string' && url ? (
                        <Button
                          key={platform}
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Button>
                      ) : null
                    ))}
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
        {/* Policies Section */}
        {(profile.policies?.returnPolicy || profile.policies?.customOrders || profile.policies?.exchanges) && (
          <Card className="mb-10">
            <Card.Header>
              <Card.Title>Store Policies</Card.Title>
            </Card.Header>
            <Card.Content>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {profile.policies?.returnPolicy && <li><span className="font-semibold">Return Policy:</span> {profile.policies.returnPolicy}</li>}
                {profile.policies?.customOrders && <li><span className="font-semibold">Custom Orders:</span> {profile.policies.customOrders ? 'Accepted' : 'Not accepted'}</li>}
                {profile.policies?.exchanges && <li><span className="font-semibold">Exchanges:</span> {profile.policies.exchanges ? 'Allowed' : 'Not allowed'}</li>}
              </ul>
            </Card.Content>
          </Card>
        )}
        {/* Products Section */}
        <Card>
          <Card.Header>
            <Card.Title>Products</Card.Title>
          </Card.Header>
          <Card.Content>
            {products.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No products found for this store.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map((product: any, idx: number) => (
                  <ProductCard
                    key={product._id || idx}
                    product={{
                      _id: product._id,
                      title: product.title,
                      description: product.description || '',
                      price: product.price,
                      images: product.images || [{ url: product.primaryImage || '' }],
                      vendor: {
                        storeName: profile.storeName,
                        _id: profile._id,
                        user: profile.user
                      },
                      ratings: {
                        average: product.ratings?.average || 0,
                        count: product.ratings?.count || 0
                      },
                      status: product.status || 'active'
                    }}
                    variant="compact"
                    showWishlist={true}
                    showAddToCart={true}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </Container>
    </div>
  );
};

export default StorePage; 