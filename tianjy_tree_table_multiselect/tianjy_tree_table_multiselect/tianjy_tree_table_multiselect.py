import frappe

@frappe.whitelist()
def get_select_options(txt, doctype):
	doctype_doc = frappe.get_doc('DocType', doctype)
	order_by = 'lft asc' if doctype_doc.is_tree else 'modified asc'
	data_list = frappe.get_list(doctype, fields=['*'], ignore_permissions=True, order_by=order_by)
	format_data_list = format_data(data_list, doctype_doc)
	return format_data_list

def format_data(data_list, doctype_doc):
	format_data_list = []
	for data in data_list:
		if doctype_doc.nsm_parent_field:
			parent = data.get(doctype_doc.nsm_parent_field) if data.get(doctype_doc.nsm_parent_field) else '#'
		else:
			parent = '#'
		format_data_list.append({
			'id':data.name,
			'parent':parent,
			'text':data.get(doctype_doc.title_field) if doctype_doc.title_field else data.name,
			'icon':False,
		})
	return format_data_list
