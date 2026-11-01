import axios from 'axios';

// true: 우리 Spring Boot 백엔드(/api/products) 사용 / false: DummyJSON 직접 호출
// 백엔드 DB에 imageUrl, category, tags가 채워진 뒤에 true로 바꾸면 됨
const USE_BACKEND = false;

const DUMMY_BASE = 'https://dummyjson.com';
const USD_TO_KRW = 1300; // DummyJSON 가격은 달러라서 화면에서 '원'처럼 보이게 환산

// 이 프로젝트에서 '가구/인테리어'로 취급할 DummyJSON 상위 카테고리
export const FURNITURE_CATEGORIES = ['furniture', 'home-decoration', 'lighting'];

const dummyClient = axios.create({ baseURL: DUMMY_BASE });
const backendClient = axios.create({ baseURL: '/api' });

/*
 * 화면(UI)은 항상 아래 모양의 상품 객체만 사용한다.
 * { id, name, price, imageUrl, category, tags, sizeX, sizeY, sizeZ, modelUrl }
 * DummyJSON / 백엔드 응답을 이 모양으로 맞추는 게 아래 두 함수의 역할.
 */
function fromDummy(p) {
  return {
    id: p.id,
    name: p.title,
    price: Math.round(p.price * USD_TO_KRW),
    imageUrl: p.thumbnail,
    category: p.category,
    tags: p.tags ?? [],
    sizeX: null,
    sizeY: null,
    sizeZ: null,
    modelUrl: null,
  };
}

function fromBackend(p) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    category: p.category,
    tags: p.tags ?? [],
    sizeX: p.sizeX,
    sizeY: p.sizeY,
    sizeZ: p.sizeZ,
    modelUrl: p.modelUrl,
  };
}

export async function fetchFurnitureProducts() {
  if (USE_BACKEND) {
    const { data } = await backendClient.get('/products');
    return data.map(fromBackend);
  }

  // DummyJSON엔 '여러 카테고리 한번에 조회'가 없어서 프론트에서 합침
  const responses = await Promise.all(
    FURNITURE_CATEGORIES.map((category) =>
      dummyClient.get(`/products/category/${category}`, { params: { limit: 0 } })
    )
  );
  return responses.flatMap((res) => res.data.products).map(fromDummy);
}

export async function fetchProductById(id) {
  if (USE_BACKEND) {
    const { data } = await backendClient.get(`/products/${id}`);
    return fromBackend(data);
  }
  const { data } = await dummyClient.get(`/products/${id}`);
  return fromDummy(data);
}

export async function searchFurnitureProducts(query) {
  if (!query?.trim()) return fetchFurnitureProducts();

  if (USE_BACKEND) {
    // 백엔드에 검색 API가 아직 없어서 전체 조회 후 이름으로 거름
    const all = await fetchFurnitureProducts();
    const keyword = query.trim().toLowerCase();
    return all.filter((p) => p.name?.toLowerCase().includes(keyword));
  }

  const { data } = await dummyClient.get('/products/search', { params: { q: query } });
  return data.products
    .filter((p) => FURNITURE_CATEGORIES.includes(p.category))
    .map(fromDummy);
}

/**
 * 상품의 tags에서 세부 분류(침대/소파/책상 등)를 뽑아 중복 제거.
 * 대분류 이름(furniture 등)은 세부 분류에서 제외.
 */
export function extractSubCategories(products) {
  const tagSet = new Set();
  products.forEach((p) => (p.tags || []).forEach((tag) => tagSet.add(tag)));
  FURNITURE_CATEGORIES.forEach((c) => tagSet.delete(c));
  return Array.from(tagSet).sort();
}