Inspector evaluates things using one or more tests and returns validation results. The reason I'm writing it is that
validation libraries that exist don't seem to express boolean series well -- i.e., "the value either doesn't exist 
or it meets these conditions" or "the value passes one of these tests".

The approach I'm taking here is that the testModule evaluators are seperate from the testModule collectors in a sort of map-reduce
form. The individual tests return etiher success or a message, and the collectors collect the net effects of these
and return a report. 
