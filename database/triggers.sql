DROP TRIGGER IF EXISTS after_purchase_products_insert;
DELIMITER //
CREATE TRIGGER after_purchase_products_insert 
AFTER INSERT ON purchase_products
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;

    IF NEW.received = 1 THEN
        SELECT qty INTO current_stock 
        FROM products 
        WHERE id = NEW.product_id 
        FOR UPDATE;

        UPDATE products 
        SET qty = (current_stock + NEW.qty) 
        WHERE id = NEW.product_id;
    END IF;
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS after_purchase_products_update;
DELIMITER //
CREATE TRIGGER after_purchase_products_update 
AFTER UPDATE ON purchase_products
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;
    DECLARE quantity_difference INT;

    IF NEW.received = 1 THEN
        SELECT qty INTO current_stock 
        FROM products 
        WHERE id = NEW.product_id 
        FOR UPDATE;

        SET quantity_difference = NEW.qty - OLD.qty;

        UPDATE products 
        SET qty = (current_stock + quantity_difference) 
        WHERE id = NEW.product_id;
    END IF;
END;
//
DELIMITER ;


DROP TRIGGER IF EXISTS after_product_sales_insert;
DELIMITER //
CREATE TRIGGER after_product_sales_insert
AFTER INSERT ON product_sales
FOR EACH ROW
BEGIN 
    DECLARE current_stock INT;

    SELECT qty INTO current_stock 
    FROM products 
    WHERE id = NEW.product_id 
    FOR UPDATE;

    UPDATE products 
    SET qty = (current_stock - NEW.qty) 
    WHERE id = NEW.product_id;
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS after_product_sales_update;
DELIMITER //
CREATE TRIGGER after_product_sales_update
AFTER UPDATE ON product_sales
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;
    DECLARE quantity_difference INT;

    SELECT qty INTO current_stock 
    FROM products 
    WHERE id = NEW.product_id 
    FOR UPDATE;

    SET quantity_difference = OLD.qty - NEW.qty;

    UPDATE products 
    SET qty = (current_stock + quantity_difference) 
    WHERE id = NEW.product_id;
END;
//
DELIMITER ;

DROP TRIGGER IF EXISTS after_product_sales_delete;
DELIMITER //
CREATE TRIGGER after_product_sales_delete
AFTER DELETE ON product_sales
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;

    SELECT qty INTO current_stock 
    FROM products 
    WHERE id = OLD.product_id 
    FOR UPDATE;

    UPDATE products 
    SET qty = (current_stock + OLD.qty) 
    WHERE id = OLD.product_id;
END;
//
DELIMITER ;

