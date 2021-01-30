package store.dao;

import java.util.List;
import java.util.Map;

import product.bean.ProductDTO;
import store.bean.StoreDTO;

public interface StoreDAO {

	public List<ProductDTO> storeProductList();

	public int storeProductTotalA();

	public StoreDTO getMember(String nickname);

	public int nicknameUpdate(Map<String, String> map);

	public List<ProductDTO> storeFavoritesList(String mem_id);

}