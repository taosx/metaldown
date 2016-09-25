package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/tidwall/buntdb"
)

// Elem contains necessary fields
type Elem struct {
	Type              string
	Size              string
	Price             int
	Weight            int
	InitialQuantity   int
	Sold              int
	RemainingQuantity int
	WarnLimit         int
}

// Duration is a naive way to profile my funcs
func Duration(invocation time.Time, name string) {
	elapsed := time.Since(invocation)

	log.Printf("%s lasted %s", name, elapsed)
}

// CreateElem creates different sizes for that metal type
func CreateElem(typ, size string, limit int) error {
	return db.Update(func(tx *buntdb.Tx) error {

		el, err := tx.Get(rk(typ, size))
		if err == nil || el != "" {
			fmt.Println("Err:", err, "Element:", el)
			return fmt.Errorf("%s %s combination already exists", typ, size)
		}

		elem := &Elem{Type: typ, Size: size, WarnLimit: limit}
		tx.Set(rk(typ, size), string(elem.Marshal()), nil)
		return nil
	})
}

// EditElem adds/modifies a size of a type of metal only if created
func EditElem(typ, size string, e *Elem) error {
	return db.Update(func(tx *buntdb.Tx) error {

		stored, err := tx.Get(rk(typ, size))
		if err == buntdb.ErrNotFound {
			return fmt.Errorf("[ERR] Action Edit: Failed: %s %s combination doesn't exist", typ, size)
		}

		element := new(Elem)

		if err = json.Unmarshal([]byte(stored), element); err != nil {
			return fmt.Errorf("[ERR] Action Edit: Failed to unmarshal %s", rk(typ, size))
		}

		element.Complete(e)
		element.Calculator()

		_, _, err = tx.Set(rk(element.Type, element.Size), string(element.Marshal()), nil)
		if err != nil {
			return fmt.Errorf("[ERR] Action Edit: Failed: %s", err.Error())
		}

		if element.Size != size {
			_, err = tx.Delete(rk(typ, size))
		}

		return err
	})
}

// GetElem retrieves the element from the bucket
func GetElem(bucket, size string) (*Elem, error) {
	elem := new(Elem)

	err := db.View(func(tx *buntdb.Tx) error {

		b, err := tx.Get(rk(bucket, size))
		if err != nil {
			return err
		}

		err = json.Unmarshal([]byte(b), elem)

		return err
	})

	return elem, err
}

// RemoveElem delete an element
func RemoveElem(bucket, size string) error {

	return db.Update(func(tx *buntdb.Tx) error {
		_, err := tx.Delete(rk(bucket, size))
		return err
	})

}

// GetElems retrieves all the elements from a bucket
func GetElems() []Elem {
	var err error
	elems := []Elem{}

	err = db.View(func(tx *buntdb.Tx) error {

		tx.Ascend("", func(key, val string) bool {
			el := bt(val).Unmarshal()
			elems = append(elems, *el)
			return true
		})

		return err
	})

	return elems
}
