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

    -- Obtener el stock actual del producto
    SELECT qty INTO current_stock 
    FROM products 
    WHERE id = NEW.product_id 
    FOR UPDATE;

    -- Caso 1: `received` cambia de 0 a 1
    IF OLD.received <> 1 AND NEW.received = 1 THEN
        UPDATE products 
        SET qty = current_stock + NEW.qty
        WHERE id = NEW.product_id;

    -- Caso 2: `received` es 1 y se actualiza `qty`
    ELSEIF OLD.received = 1 AND NEW.received = 1 THEN
        UPDATE products 
        SET qty = current_stock + (OLD.qty - NEW.qty)
        WHERE id = NEW.product_id;

    -- Caso 3: `received` cambia de 1 a otro valor
    ELSEIF OLD.received = 1 AND NEW.received <> 1 THEN
        UPDATE products 
        SET qty = current_stock - OLD.qty
        WHERE id = NEW.product_id;
    END IF;
END;
//
DELIMITER ;


DROP TRIGGER IF EXISTS after_purchase_products_delete;
DELIMITER //
CREATE TRIGGER after_purchase_products_delete
AFTER DELETE ON purchase_products
FOR EACH ROW
BEGIN
    DECLARE current_stock INT;

    SELECT qty INTO current_stock 
    FROM products 
    WHERE id = OLD.product_id 
    FOR UPDATE;

    UPDATE products 
    SET qty = (current_stock - OLD.qty)


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

