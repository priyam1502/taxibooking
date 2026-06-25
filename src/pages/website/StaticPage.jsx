import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cmsApi } from '../../api/rideApi';

/**
 * Renders CMS-backed static pages. Pass a `cmsKey` prop OR use the :key route param.
 */
const StaticPage = ({ cmsKey, fallbackTitle }) => {
  const params = useParams();
  const key = cmsKey || params.key;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cmsApi
      .getPage(key)
      .then(({ data }) => setPage(data.cms))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [key]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{page?.title || fallbackTitle}</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : page ? (
        <div className="prose text-gray-700" dangerouslySetInnerHTML={{ __html: page.content }} />
      ) : (
        <p className="text-gray-500">Content coming soon.</p>
      )}
    </div>
  );
};

export default StaticPage;
