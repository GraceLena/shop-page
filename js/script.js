$(function() {
	const init = () => {
		initBuyBtn();
		$('#add-to-cart').click(addProductToCart);
		$('#load-more').click(loadMoreProducts);
		$('.add-product-count').change(calcCost);
		initSearchForm();
		$('#btn-search').click(goSearch);
		$('.remove-product').click(removeProduct);
	};

	const showProductPopup = function (){
		const idProduct = $(this).attr('data-id-product');
		const product = $('#product' + idProduct);
		const price = product.find('.product-price').text();
		$('#add-product-popup').attr('data-id-product', idProduct);
		$('#add-product-popup .add-product-image').attr('src', product.find('.thumbnail img').attr('src'));
		$('#add-product-popup .add-product-name').text(product.find('.product-name').text());
		$('#add-product-popup .add-product-price').text(price);
		$('#add-product-popup .add-product-category').text(product.find('.product-category').text());
		$('#add-product-popup .add-product-producer').text(product.find('.product-producer').text());
		$('#add-product-popup .add-product-count').val(1);
		$('#add-product-popup .add-product-cost').text(price);
		$('#add-to-cart-indicator').addClass('hidden');
		$('#add-to-cart').removeClass('hidden');
		
		$('#add-product-popup').modal({
			show:true
		});
	};

	const initBuyBtn = () => {
		$('.buy-btn').click(showProductPopup);
	}

	const addProductToCart = function() {
		const idProduct = $('#add-product-popup').attr('data-id-product');
		const count = $('#add-product-popup .add-product-count').val();
		$('#add-to-cart-indicator').removeClass('hidden');
		$('#add-to-cart').addClass('hidden');
		setTimeout(function() {
			const data = { // from server
				totalCount: count,
				totalCost: 2000
			};
			$('#shopping-cart-menu .total-count').text(data.totalCount);
			$('.shopping-cart-items .total-cost').text(data.totalCost);
			$('#shopping-cart-menu').removeClass('hidden');
			$('#add-product-popup').modal('hide');
		}, 800);
	};

	const calcCost = function() {
		const priceStr = $('#add-product-popup .add-product-price').text();
		const price = parseFloat(priceStr.replace('$ ', ''));
		const count = parseInt( $('#add-product-popup .add-product-count').val());
		const min = parseInt( $('#add-product-popup .add-product-count').attr('min'));
		const max = parseInt( $('#add-product-popup .add-product-count').attr('max'));

		if(count >= min && count <= max) {
			const cost = price * count;
			$('.add-product-cost').text('$ ' + cost);
		} else {
			$('.add-product-cost').text(priceStr);
			$('#add-product-popup .add-product-count').val(1);
		}
	};

	const loadMoreProducts = function() {
		$('#load-more-indicator').removeClass('hidden');
		$('#load-more').addClass('hidden');
		setTimeout(function() {
			$('#load-more-indicator').addClass('hidden');
			$('#load-more').removeClass('hidden');
		}, 800);
	};

	const initSearchForm = function() {
		$('#all-categories').click(function() {
			$('.categories .search-option').prop('checked', $(this).prop('checked'));
		});
		$('.categories .search-option').click(function() {
			$('#all-categories').prop('checked', false);
		});

		$('#all-producers').click(function() {
			$('.producers .search-option').prop('checked', $(this).prop('checked'));
		});
		$('.producers .search-option').click(function() {
			$('#all-producers').prop('checked', false);
		});
	};

	const goSearch = function() {
		const isAllSelected = function(selector) {
			let unchecked = 0;

			$(selector).each(function(index, value) {
				if(! $(value).is(':checked')) {
					unchecked++;
				}
			});
			return unchecked === 0;
		};
		if(isAllSelected('.categories .search-option')) {
			$('.categories .search-option').prop('checked', false);
		}
		if(isAllSelected('.producers .search-option')) {
			$('.producers .search-option').prop('checked', false);
		}
		$('#product-search').submit();
	};

	const confirmMesage = function(msg, okFunction) {
		if(window.confirm(msg)) {
			okFunction();
		}
	};

	const removeProduct = function() {
		const btn = $(this);
		confirmMesage('Are you sure?', function() {
			executeRemoveProduct(btn);
		});
	};

	const refreshTotalCost = function () {
		let total = 0;
		$('#shopping-cart .table-row').each(function(index, value) {
			const count = parseInt($(value).find('.count').text());
			const price = parseFloat($(value).find('.price').text().replace('$', ' '));
			const val = price * count;
			total = total + val;
		});
		$('#shopping-cart .total').text('$' + total);
	};

	const executeRemoveProduct = function(btn) {
		const idProduct = btn.attr('data-id-product');
		const count = btn.attr('data-count');
		btn.removeClass('btn');
		btn.removeClass('btn-danger');
		btn.addClass('load-indicator');
		const text = btn.text();
		btn.text('');
		btn.off('click');

		setTimeout(function() {
			const data = { // from server
				totalCount: count,
				totalCost: 2000
			};
			if(data.totalCount === 0) {
				window.location.href = 'index.html';
			} else {
				const prevCount = parseInt($('#product' + idProduct + ' .count').text());
				const remCount = parseInt(count);
				if(prevCount === remCount) {
					$('#product' + idProduct).remove();
					// 
					if($('#shopping-cart .table-row').length === 0) {
						window.location.href = 'index.html';
					}
					//
				} else {
					btn.removeClass('load-indicator');
					btn.addClass('btn');
					btn.addClass('btn-danger');
					btn.text(text);
					btn.click(removeProduct);
					$('#product' + idProduct + ' .count').text(prevCount - remCount);
					if(prevCount - remCount == 1) {
						$('#product' + idProduct + ' a.remove-product .remove-all').remove();
					}
				}
				refreshTotalCost();
			}
		}, 1000);
	};

	init();
});