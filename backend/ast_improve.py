import ast

class CodeImprover(ast.NodeTransformer):
    def visit_For(self, node):
        if (
            isinstance(node.iter, ast.Call)
            and isinstance(node.iter.func, ast.Name)
            and node.iter.func.id == "range"
        ):
            args = node.iter.args
            if (
                len(args) == 1
                and isinstance(args[0], ast.Call)
                and isinstance(args[0].func, ast.Name)
                and args[0].func.id == "len"
            ):
                seq = args[0].args[0]
                node.iter = seq
                node.target = ast.Name(id="value", ctx=ast.Store())
        return self.generic_visit(node)

def ast_improve(code):
    try:
        tree = ast.parse(code)
        tree = CodeImprover().visit(tree)
        ast.fix_missing_locations(tree)
        return ast.unparse(tree)
    except Exception:
        return None
